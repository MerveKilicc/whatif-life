import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  if (!locale || !['tr'].includes(locale)) {
    locale = 'tr';
  }
 
  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  };
});
