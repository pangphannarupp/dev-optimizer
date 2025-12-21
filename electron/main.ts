import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn } from 'node:child_process'
import ffmpegPath from 'ffmpeg-static'

const APP_ROOT = path.dirname(fileURLToPath(import.meta.url))

process.env.DIST = path.join(APP_ROOT, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
let splash: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

// Resolve yt-dlp path
const ytDlpPath = app.isPackaged
  ? path.join(process.resourcesPath, 'bin', 'yt-dlp')
  : path.join(APP_ROOT, '../electron/bin/yt-dlp');

// Prepare ffmpeg path
let safeFfmpegPath = ffmpegPath;
if (safeFfmpegPath) {
  safeFfmpegPath = safeFfmpegPath.replace('app.asar', 'app.asar.unpacked');
}

function createWindow() {
  splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
  })

  splash.loadFile(path.join(process.env.VITE_PUBLIC, 'splash.html'))
  splash.center()

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(APP_ROOT, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'))
  }

  win.once('ready-to-show', () => {
    setTimeout(() => {
      splash?.destroy()
      splash = null
      win?.show()
      win?.focus()
    }, 3000)
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
    splash = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Helper to run yt-dlp
function runYtDlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Running yt-dlp: ${ytDlpPath} ${args.join(' ')}`);
    const proc = spawn(ytDlpPath, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        console.error('yt-dlp error:', stderr);
        reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`));
      }
    });

    proc.on('error', (err) => {
      console.error('Failed to spawn yt-dlp:', err);
      reject(err);
    });
  });
}

app.whenReady().then(() => {
  createWindow()

  // --- YouTube Downloader Handlers (spawn yt-dlp) ---

  ipcMain.handle('youtube:getInfo', async (_, url: string) => {
    try {
      const args = [
        url,
        '--dump-single-json',
        '--no-warnings',
        '--no-call-home',
        '--prefer-free-formats',
        '--skip-download',
        '--flat-playlist'
      ];

      const jsonStr = await runYtDlp(args);
      const raw = JSON.parse(jsonStr);

      if (raw._type === 'playlist') {
        return {
          type: 'playlist',
          title: raw.title,
          thumbnail: raw.thumbnails?.[0]?.url || '',
          videoCount: raw.entries?.length || 0,
          items: (raw.entries || []).map((item: any) => ({
            title: item.title,
            url: item.url || `https://www.youtube.com/watch?v=${item.id}`,
            thumbnail: item.thumbnails?.[0]?.url || '',
            duration: item.duration,
            author: item.uploader
          }))
        };
      } else {
        const qualityOptions = (raw.formats || [])
          .filter((f: any) => f.vcodec !== 'none' && f.height)
          .reduce((acc: any[], f: any) => {
            const isDuplicate = acc.some(item => item.height === f.height && item.fps === f.fps);
            if (!isDuplicate) {
              acc.push({
                height: f.height,
                fps: f.fps || 30,
                label: `${f.height}p${f.fps && f.fps > 30 ? ` ${f.fps}fps` : ''}`
              });
            }
            return acc;
          }, [])
          .sort((a: any, b: any) => {
            if (a.height !== b.height) return b.height - a.height;
            return b.fps - a.fps;
          });

        return {
          type: 'video',
          title: raw.title,
          thumbnail: raw.thumbnail,
          duration: raw.duration,
          author: raw.uploader,
          qualityOptions
        };
      }
    } catch (error: any) {
      console.error('Error fetching info:', error);
      throw new Error(error.message || 'Failed to fetch video info');
    }
  });

  ipcMain.handle('youtube:selectFolder', async () => {
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory']
    });
    if (result.canceled) return null;
    return result.filePaths[0];
  });

  ipcMain.handle('youtube:download', async (_, { url, type, outputDir, fileName, resolution, fps }: { url: string, type: 'video' | 'audio', outputDir: string, fileName: string, resolution?: number, fps?: number }) => {
    const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const outputTemplate = path.join(outputDir, `${safeFileName}.%(ext)s`);

    return new Promise((resolve, reject) => {
      try {
        const args = [
          url,
          '-o', outputTemplate,
          '--no-warnings',
          '--no-call-home',
          '--ffmpeg-location', safeFfmpegPath!,
          '--newline' // For progress parsing
        ];

        if (type === 'audio') {
          args.push('--extract-audio', '--audio-format', 'mp3', '--format', 'bestaudio/best');
        } else {
          if (resolution) {
            const fpsSelector = fps ? `[fps=${fps}]` : '';
            args.push('--format', `bestvideo[height=${resolution}]${fpsSelector}+bestaudio/best[height=${resolution}]${fpsSelector}`, '--merge-output-format', 'mp4');
          } else {
            args.push('--format', 'bestvideo+bestaudio/best', '--merge-output-format', 'mp4');
          }
        }

        console.log(`Starting download: ${ytDlpPath} ${args.join(' ')}`);
        const proc = spawn(ytDlpPath, args);

        proc.stdout.on('data', (data) => {
          const line = data.toString();
          // [download]  45.0% of 10.00MiB at ...
          const match = line.match(/\[download\]\s+(\d+\.\d+)%/);
          if (match && match[1]) {
            const percent = parseFloat(match[1]);
            if (win && !isNaN(percent)) {
              win.webContents.send('download:progress', { url, percent });
            }
          }
        });

        let stderr = '';
        proc.stderr.on('data', (d) => stderr += d.toString());

        proc.on('close', (code) => {
          if (code === 0) {
            resolve(path.join(outputDir, `${safeFileName}.${type === 'audio' ? 'mp3' : 'mp4'}`));
          } else {
            console.error('Download failed:', stderr);
            reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`));
          }
        });

        proc.on('error', (err) => {
          reject(err);
        });

      } catch (e) {
        reject(e);
      }
    });

  });
})
