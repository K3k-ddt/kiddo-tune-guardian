import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6de214f9652441c0ac5e9af187fcd857',
  appName: 'kiddo-tune-guardian',
  webDir: 'dist',
  server: {
    url: 'https://6de214f9-6524-41c0-ac5e-9af187fcd857.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#8B5CF6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
