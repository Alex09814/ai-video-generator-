import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.videoforge.ai',
  appName: 'VideoForge AI',
  webDir: 'out',
  server: {
    url: 'https://ai-video-generator-g3j5hja9c-alex09814.vercel.app/game',
    cleartext: false
  }
};

export default config;
