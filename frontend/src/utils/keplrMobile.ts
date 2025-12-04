// Mobile deep linking utilities for Keplr wallet
export const KeplrMobileDeepLink = {
  // Check if we're on mobile
  isMobile: () => {
    return typeof window !== 'undefined' &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Check if we're on iOS
  isIOS: () => {
    return typeof window !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Check if we're on Android
  isAndroid: () => {
    return typeof window !== 'undefined' &&
      /Android/i.test(navigator.userAgent);
  },

  // Get app store URLs
  getStoreUrls: () => ({
    ios: 'https://apps.apple.com/app/keplr-wallet/id1567851089',
    android: 'https://play.google.com/store/apps/details?id=com.chainapsis.keplr'
  }),

  // Try to open Keplr mobile app with deep link
  openKeplrApp: (fallbackUrl?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!KeplrMobileDeepLink.isMobile()) {
        resolve(false);
        return;
      }

      const keplrScheme = 'keplr://';
      const fallback = fallbackUrl || (
        KeplrMobileDeepLink.isIOS()
          ? KeplrMobileDeepLink.getStoreUrls().ios
          : KeplrMobileDeepLink.getStoreUrls().android
      );

      // Create a hidden iframe to trigger the deep link
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      let hasAppInstalled = false;

      // Set timer to detect if app opened
      const timer = setTimeout(() => {
        if (!hasAppInstalled) {
          // App not installed, redirect to store
          window.location.href = fallback;
        }
        document.body.removeChild(iframe);
        resolve(hasAppInstalled);
      }, 2000);

      // Listen for visibility change (indicates app opened)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          hasAppInstalled = true;
          clearTimeout(timer);
          resolve(true);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Try to open the app
      iframe.src = keplrScheme;

      // Cleanup
      setTimeout(() => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }, 3000);
    });
  },

  // Create a user-friendly redirect flow
  redirectToKeplr: async (showConfirm = true): Promise<boolean> => {
    if (!KeplrMobileDeepLink.isMobile()) {
      return false;
    }

    const stores = KeplrMobileDeepLink.getStoreUrls();
    const platform = KeplrMobileDeepLink.isIOS() ? 'iOS' : 'Android';
    const storeUrl = KeplrMobileDeepLink.isIOS() ? stores.ios : stores.android;

    if (showConfirm) {
      const message = `To connect your wallet, you need Keplr Mobile app.\n\nWould you like to download it from ${platform} App Store?`;

      if (!confirm(message)) {
        return false;
      }
    }

    // First try to open existing app
    const appOpened = await KeplrMobileDeepLink.openKeplrApp(storeUrl);

    if (!appOpened) {
      // If app didn't open, go to store
      window.open(storeUrl, '_blank');
    }

    return true;
  },

  // Generate QR code data for desktop->mobile workflow
  generateQRData: (chainId: string, action: string = 'connect'): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?mobile=1&chain=${chainId}&action=${action}`;
  }
};

export default KeplrMobileDeepLink;
