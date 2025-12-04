const path = require('path');

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he', 'ar', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'ru', 'pt', 'it'],
    localePath: path.resolve('./public/locales'),
    localeDetection: true,
  },
  returnObjects: true,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};
