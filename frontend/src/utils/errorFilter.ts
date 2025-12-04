// Error filtering utility to reduce noise in development console
// This helps suppress known Keplr extension loading errors

export const suppressKnownErrors = () => {
  if (typeof window === 'undefined') return;

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // List of error patterns to suppress (these are known Keplr loading issues)
  const suppressedPatterns = [
    'Could not establish connection',
    'Receiving end does not exist',
    'browser-polyfill.js',
    'background.bundle.js',
    'Failed to get response from https://opbaqquqruxn7fdsgcncrtfrwa0qxnoj.lambda-url',
    'Extension context invalidated'
  ];

  // Override console.error
  console.error = (...args: any[]) => {
    const message = args.join(' ');

    // Check if this error should be suppressed
    const shouldSuppress = suppressedPatterns.some(pattern =>
      message.includes(pattern)
    );

    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };

  // Override console.warn
  console.warn = (...args: any[]) => {
    const message = args.join(' ');

    // Check if this warning should be suppressed
    const shouldSuppress = suppressedPatterns.some(pattern =>
      message.includes(pattern)
    );

    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };

  // Return cleanup function
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
  };
};

// Auto-suppress errors in development
if (process.env.NODE_ENV === 'development') {
  suppressKnownErrors();
}
