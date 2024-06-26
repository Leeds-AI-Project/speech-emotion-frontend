import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.speech.emotion',
  appName: 'speech-emotion',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true,
    // TODO: Live Reload
    //  URL 需要自行配置，并使用 "pnpm dev --host" 开启5173端口的Vitest服务器
    // url: 'http://<YOUR_IPV4_ADDRESS>:5173'
    url: 'http://localhost:5173/'
    // url: 'http://server.wmzspace.space:8088/'
  }
};

export default config;
