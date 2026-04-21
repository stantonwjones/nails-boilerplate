import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nailsapp',
  appName: 'Nails',
  webDir: 'mobile-dist',
  server: {
    // url: 'https://development.parkwaysapp.com',
    // androidScheme: "android",
    // hostname: 'development.parkwaysapp.com',
    // cleartext: true,
    // allowNavigation: [
    //   '*',
    //   "https://accounts.google.com/*",
    //   "accounts.google.com",
    //   "https://oauthreceiver.parkwaysapp.com",
    //   "*.parkwaysapp.com",
    //   "https://oauthreceiver.parkwaysapp.com/*"],
  }
  // appendUserAgent: "ANDROID_CAPACITOR",
  // android: {
  //   allowMixedContent: true,
  //   appendUserAgent: "ANDROID_CAPACITOR",
  // }
};

export default config;
