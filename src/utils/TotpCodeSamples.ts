export const totpSamples = {
  android: {
    label: 'Android (Kotlin)',
    language: 'kotlin',
    code: `// --- layout/activity_totp.xml ---
/*
<LinearLayout ... android:orientation="vertical" android:gravity="center">
    <!-- Code Display -->
    <TextView
        android:id="@+id/tvCode"
        android:textSize="48sp"
        android:text="000 000" ... />

    <!-- Countdown Progress -->
    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressButtonStyleHorizontal"
        android:max="3000" ... />
</LinearLayout>
*/

// --- TotpActivity.kt ---
import android.os.Handler
import android.os.Looper
// ... imports

class TotpActivity : AppCompatActivity() {
    private val handler = Handler(Looper.getMainLooper())
    private val secret = "JBSWY3DPEHPK3PXP" // Example

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_totp)
        startTimer()
    }

    private fun startTimer() {
        val runnable = object : Runnable {
            override fun run() {
                updateUI()
                handler.postDelayed(this, 100)
            }
        }
        handler.post(runnable)
    }

    private fun updateUI() {
        // Logic from previous step
        val code = generateTOTP(secret) 
        
        // Update Text
        binding.tvCode.text = "\${code.substring(0, 3)} \${code.substring(3)}"
        
        // Update Progress (30s window)
        val epoch = System.currentTimeMillis()
        val millisLeft = 30000 - (epoch % 30000)
        binding.progressBar.progress = (millisLeft / 10).toInt()
    }
}`
  },
  androidJava: {
    label: 'Android (Java)',
    language: 'java',
    code: `// Build.gradle
// implementation 'commons-codec:commons-codec:1.15'

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import org.apache.commons.codec.binary.Base32;
import java.nio.ByteBuffer;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class TotpActivity extends AppCompatActivity {
    private TextView tvCode;
    private ProgressBar progressBar;
    private final String secret = "JBSWY3DPEHPK3PXP";
    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable timerRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_totp);
        
        tvCode = findViewById(R.id.tvCode);
        progressBar = findViewById(R.id.progressBar);
        
        startTimer();
    }

    private void startTimer() {
        timerRunnable = new Runnable() {
            @Override
            public void run() {
                updateUI();
                handler.postDelayed(this, 100);
            }
        };
        handler.post(timerRunnable);
    }

    private void updateUI() {
        try {
            long now = System.currentTimeMillis();
            String code = generateTOTP(secret, now);
            
            // Format 000 000
            tvCode.setText(code.substring(0, 3) + " " + code.substring(3));
            
            // Progress
            long millisLeft = 30000 - (now % 30000);
            progressBar.setProgress((int)(millisLeft / 10)); // Max 3000
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String generateTOTP(String secret, long time) throws Exception {
        Base32 base32 = new Base32();
        byte[] bytes = base32.decode(secret);
        long timeWindow = time / 30000;
        
        byte[] data = ByteBuffer.allocate(8).putLong(timeWindow).array();
        SecretKeySpec signKey = new SecretKeySpec(bytes, "HmacSHA1");
        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(signKey);
        byte[] hash = mac.doFinal(data);

        int offset = hash[hash.length - 1] & 0xF;
        long truncatedHash = 0;
        for (int i = 0; i < 4; ++i) {
            truncatedHash <<= 8;
            truncatedHash |= (hash[offset + i] & 0xFF);
        }
        truncatedHash &= 0x7FFFFFFF;
        long otp = truncatedHash % 1000000;
        
        return String.format("%06d", otp); // 6 Digits
    }
}`
  },
  ios: {
    label: 'iOS (SwiftUI)',
    language: 'swift',
    code: `import SwiftUI
import SwiftOTP

struct TotpView: View {
    let secret: String = "JBSWY3DPEHPK3PXP"
    @State private var code: String = "000 000"
    @State private var progress: Double = 1.0
    
    let timer = Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
    
    var body: some View {
        VStack(spacing: 20) {
            // Code Display
            Text(code)
                .font(.system(size: 48, weight: .bold, design: .monospaced))
                
            // Countdown Circle
            ZStack {
                Circle()
                    .stroke(lineWidth: 10)
                    .opacity(0.3)
                    .foregroundColor(.blue)
                
                Circle()
                    .trim(from: 0.0, to: CGFloat(progress))
                    .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round, lineJoin: .round))
                    .foregroundColor(.blue)
                    .rotationEffect(Angle(degrees: 270.0))
                    .animation(.linear, value: progress)
            }
            .frame(width: 100, height: 100)
        }
        .onReceive(timer) { _ in
            updateTOTP()
        }
        .onAppear { updateTOTP() }
    }
    
    func updateTOTP() {
        // Generate logic
        if let data = base32DecodeToData(secret),
           let totp = TOTP(secret: data, digits: 6, timeInterval: 30, algorithm: .sha1) {
            
            let newCode = totp.generate(time: Date()) ?? "Error"
            // Format 000 000
            let prefix = newCode.prefix(3)
            let suffix = newCode.suffix(3)
            self.code = "\(prefix) \(suffix)"
            
            // Update Progress
            let epoch = Date().timeIntervalSince1970
            let timeLeft = 30.0 - fmod(epoch, 30.0)
            self.progress = timeLeft / 30.0
        }
    }
}`
  },
  iosUIKit: {
    label: 'iOS (UIKit)',
    language: 'swift',
    code: `import UIKit
import SwiftOTP

class TotpViewController: UIViewController {

    // Connect via Storyboard or standard init
    @IBOutlet weak var codeLabel: UILabel!
    @IBOutlet weak var progressView: UIProgressView!
    
    let secret = "JBSWY3DPEHPK3PXP"
    var timer: Timer?

    override func viewDidLoad() {
        super.viewDidLoad()
        // Start Timer
        timer = Timer.scheduledTimer(
            timeInterval: 0.1, 
            target: self, 
            selector: #selector(updateUI), 
            userInfo: nil, 
            repeats: true
        )
        updateUI()
    }
    
    deinit {
        timer?.invalidate()
    }

    @objc func updateUI() {
        guard let data = base32DecodeToData(secret),
              let totp = TOTP(secret: data, digits: 6, timeInterval: 30, algorithm: .sha1) else { return }
        
        // 1. Generate Code
        if let newCode = totp.generate(time: Date()) {
            let prefix = newCode.prefix(3)
            let suffix = newCode.suffix(3)
            codeLabel.text = "\\(prefix) \\(suffix)"
        }
        
        // 2. Update Progress
        let epoch = Date().timeIntervalSince1970
        let timeLeft = 30.0 - fmod(epoch, 30.0)
        progressView.setProgress(Float(timeLeft / 30.0), animated: true)
    }
}`
  },

  iosObjc: {
    label: 'iOS (Obj-C)',
    language: 'objectivec',
    code: `// ViewController.m
#import "ViewController.h"
#import <CommonCrypto/CommonHMAC.h>

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UILabel *codeLabel;
@property (weak, nonatomic) IBOutlet UIProgressView *progressView;
@property (nonatomic, strong) NSTimer *timer;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.timer = [NSTimer scheduledTimerWithTimeInterval:0.1 
                                                  target:self 
                                                selector:@selector(updateUI) 
                                                userInfo:nil 
                                                 repeats:YES];
    [self updateUI];
}

- (void)updateUI {
    NSString *secret = @"JBSWY3DPEHPK3PXP";
    NSString *code = [self generateTOTP:secret];
    
    // Format 000 000
    if (code.length == 6) {
        NSString *prefix = [code substringToIndex:3];
        NSString *suffix = [code substringFromIndex:3];
        self.codeLabel.text = [NSString stringWithFormat:@"%@ %@", prefix, suffix];
    }
    
    // Progress
    NSTimeInterval epoch = [[NSDate date] timeIntervalSince1970];
    double timeLeft = 30.0 - fmod(epoch, 30.0);
    [self.progressView setProgress:(timeLeft / 30.0) animated:YES];
}

- (NSString *)generateTOTP:(NSString *)secret {
    // Note: You need a Base32 decode helper here. 
    // This is raw logic for demo purposes.
    
    // For demo, assume secretData is valid logic from a helper
    NSData *secretData = [secret dataUsingEncoding:NSASCIIStringEncoding]; // Placeholder: Use real Base32 decode
    if (!secretData) return nil;
    
    uint64_t time = (uint64_t)([[NSDate date] timeIntervalSince1970] / 30.0);
    time = NSSwapHostLongLongToBig(time);
    NSData *timeData = [NSData dataWithBytes:&time length:sizeof(time)];
    
    uint8_t hash[CC_SHA1_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA1, secretData.bytes, secretData.length, timeData.bytes, timeData.length, hash);
    
    int offset = hash[CC_SHA1_DIGEST_LENGTH - 1] & 0x0F;
    int binary = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);
                 
    int otp = binary % 1000000;
    return [NSString stringWithFormat:@"%06d", otp]; // 6 Digits
}
@end`
  },
  flutter: {
    label: 'Flutter (Dart)',
    language: 'dart',
    code: `import 'package:flutter/material.dart';
import 'package:otp/otp.dart';
import 'dart:async';

class TotpScreen extends StatefulWidget {
  @override
  _TotpScreenState createState() => _TotpScreenState();
}

class _TotpScreenState extends State<TotpScreen> {
  String _secret = "JBSWY3DPEHPK3PXP";
  String _code = "000 000";
  double _progress = 1.0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(Duration(milliseconds: 100), (timer) => _update());
    _update();
  }

  void _update() {
    final now = DateTime.now().millisecondsSinceEpoch;
    
    // Generate Code
    final rawCode = OTP.generateTOTPCodeString(
      _secret, now, 
      interval: 30, algorithm: Algorithm.SHA1, length: 6, isGoogle: true
    );
    
    // Update State
    setState(() {
      _code = "\${rawCode.substring(0, 3)} \${rawCode.substring(3)}";
      
      final timeLeft = 30000 - (now % 30000);
      _progress = timeLeft / 30000.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_code, style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold)),
            SizedBox(height: 20),
            CircularProgressIndicator(
              value: _progress, 
              strokeWidth: 8,
            ),
            SizedBox(height: 10),
            Text("\${(_progress * 30).toInt()}s"),
          ],
        ),
      ),
    );
  }
}`
  },
  reactNative: {
    label: 'React Native (JS)',
    language: 'javascript',
    code: `import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as OTPAuth from 'otpauth';

// npm install react-native-progress

export default function TotpScreen() {
  const [code, setCode] = useState("000 000");
  const [timeLeft, setTimeLeft] = useState(30);
  const secret = "JBSWY3DPEHPK3PXP";

  useEffect(() => {
    const timer = setInterval(() => {
        const totp = new OTPAuth.TOTP({
            algorithm: 'SHA1', digits: 6, period: 30,
            secret: OTPAuth.Secret.fromBase32(secret)
        });
        
        const raw = totp.generate();
        setCode(\`\${raw.slice(0,3)} \${raw.slice(3)}\`);
        
        const epoch = Math.floor(Date.now() / 1000);
        setTimeLeft(30 - (epoch % 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.progressContainer}>
        {/* Simple Text Progress for demo */}
        <Text style={styles.timer}>{timeLeft}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  code: { fontSize: 48, fontWeight: 'bold' },
  timer: { fontSize: 20, color: 'gray' }
});`
  },
  react: {
    label: 'React (TS)',
    language: 'typescript',
    code: `import React, { useState, useEffect } from 'react';
import * as OTPAuth from 'otpauth';

export const TotpDisplay = ({ secret }: { secret: string }) => {
  const [code, setCode] = useState("000 000");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const tick = () => {
      // 1. Generate
      const totp = new OTPAuth.TOTP({
        algorithm: 'SHA1', digits: 6, period: 30,
        secret: OTPAuth.Secret.fromBase32(secret)
      });
      const raw = totp.generate();
      setCode(\`\${raw.slice(0,3)} \${raw.slice(3)}\`);

      // 2. Progress
      const epoch = Date.now();
      const left = 30000 - (epoch % 30000);
      setProgress((left / 30000) * 100);
    };

    tick();
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [secret]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-4xl font-mono font-bold">{code}</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-100 ease-linear" 
            style={{ width: \`\${progress}%\` }}
        ></div>
      </div>
    </div>
  );
};`
  },
  vue: {
    label: 'Vue (TS)',
    language: 'html',
    code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as OTPAuth from 'otpauth';

const secret = "JBSWY3DPEHPK3PXP";
const code = ref("000 000");
const progress = ref(100);
let timer: number;

const update = () => {
  const totp = new OTPAuth.TOTP({
    algorithm: 'SHA1', digits: 6, period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });
  
  const raw = totp.generate();
  code.value = \`\${raw.slice(0, 3)} \${raw.slice(3)}\`;

  const epoch = Date.now();
  const msLeft = 30000 - (epoch % 30000);
  progress.value = (msLeft / 30000) * 100;
};

onMounted(() => {
  update();
  timer = setInterval(update, 100);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="totp-container">
    <div class="code">{{ code }}</div>
    <div class="progress-track">
      <div 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.totp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.code {
  font-size: 2.5rem;
  font-family: monospace;
  font-weight: bold;
}
.progress-track {
  width: 100%;
  height: 10px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #2563eb;
  transition: width 0.1s linear;
}
</style>`
  },
  angular: {
    label: 'Angular',
    language: 'typescript',
    code: `// totp.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as OTPAuth from 'otpauth';

@Component({
  selector: 'app-totp',
  template: \`
    <div class="totp-container">
      <h1 class="code">{{ code }}</h1>
      <div class="progress-bar">
        <div class="fill" [style.width.%]="progress"></div>
      </div>
      <p>{{ timeLeft }}s</p>
    </div>
  \`,
  styles: [\`
    .code { font-size: 3rem; font-family: monospace; }
    .progress-bar { width: 100%; height: 10px; background: #eee; }
    .fill { height: 100%; background: blue; transition: width 0.1s linear; }
  \`]
})
export class TotpComponent implements OnInit, OnDestroy {
  secret = "JBSWY3DPEHPK3PXP";
  code = "000 000";
  progress = 100;
  timeLeft = 30;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => this.update(), 100);
    this.update();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  update() {
    // Generate
    const totp = new OTPAuth.TOTP({
       secret: OTPAuth.Secret.fromBase32(this.secret),
       digits: 6, period: 30
    });
    const raw = totp.generate();
    this.code = \`\${raw.slice(0, 3)} \${raw.slice(3)}\`;

    // Timer
    const epoch = Date.now();
    const msLeft = 30000 - (epoch % 30000);
    this.progress = (msLeft / 30000) * 100;
    this.timeLeft = Math.ceil(msLeft / 1000);
  }
}`
  }
};
