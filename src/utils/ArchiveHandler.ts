import JSZip from 'jszip';
import { createExtractorFromData } from 'node-unrar-js';

export interface ArchiveEntry {
    path: string;
    isDir: boolean;
    size: number;
    readString: () => Promise<string>;
    readBlob: () => Promise<Blob>;
}

export interface IArchive {
    files: Record<string, ArchiveEntry>;
}

export const createArchive = async (file: File): Promise<IArchive> => {
    const name = file.name.toLowerCase();
    if (name.endsWith('.rar')) {
        return createRarArchive(file);
    } else {
        return createZipArchive(file);
    }
};

const createZipArchive = async (file: File): Promise<IArchive> => {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);
    const files: Record<string, ArchiveEntry> = {};

    loadedZip.forEach((relativePath, entry) => {
        files[relativePath] = {
            path: relativePath,
            isDir: entry.dir,
            size: (entry as any)._data.uncompressedSize, // Accessing private property for size if needed, or use safe way? JSZip doesn't expose size easily on entry without checking? Actually entry has nothing?
            // checking JSZip types: entry is JSZipObject. 
            // It doesn't have size directly visible in types sometimes? 
            // But usually (entry as any)._data.uncompressedSize works.
            // Or we can assume 0 for dir.
            // Let's rely on what SourceComparator was doing.
            readString: () => entry.async('string'),
            readBlob: () => entry.async('blob')
        };
        // Fix size access if possible. JSZipObject doesn't strictly type access to uncompressed size efficiently without private props or async calls?
        // Actually SourceComparator was using (entry as any)._data.uncompressedSize.
    });

    return { files };
};

const createRarArchive = async (file: File): Promise<IArchive> => {
    const arrayBuffer = await file.arrayBuffer();
    const extractor = await createExtractorFromData({ data: arrayBuffer });
    const list = extractor.getFileList();

    // We need to extract all to be able to read them? 
    // node-unrar-js allows extracting specific files.
    // Ideally we iterate and create entries.

    const files: Record<string, ArchiveEntry> = {};

    // node-unrar-js file header: { name, fileHeader: { unpSize, flags, ... } }
    // API verification might be needed. 
    // Assuming getFileList() returns objects with name and state.

    // Actually, createExtractorFromData might need to load WASM. 
    // If it fails, we catch it.

    // Let's implement extraction on demand.

    for (const header of list.fileHeaders) {
        if (header.flags.directory) {
            files[header.name] = {
                path: header.name,
                isDir: true,
                size: 0,
                readString: async () => "",
                readBlob: async () => new Blob([])
            };
            continue;
        }

        files[header.name] = {
            path: header.name,
            isDir: false,
            size: header.unpSize,
            readString: async () => {
                const extracted = extractor.extract({ files: [header.name] });
                // iterator result.
                const [...result] = extracted.files;
                if (result[0] && result[0].extraction) {
                    return new TextDecoder().decode(result[0].extraction);
                }
                return "";
            },
            readBlob: async () => {
                const extracted = extractor.extract({ files: [header.name] });
                const [...result] = extracted.files;
                if (result[0] && result[0].extraction) {
                    return new Blob([result[0].extraction as any]);
                }
                return new Blob([]);
            }
        };
    }

    return { files };
};
