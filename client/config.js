import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
export const API = publicRuntimeConfig.NODE === 'production' ? publicRuntimeConfig.API_PRODUCTION : publicRuntimeConfig.API_DEVELOPMENT;
export const APP_NAME = publicRuntimeConfig.APP_NAME;
export const REACT_APP_RECAPTCHA_KEY = publicRuntimeConfig.REACT_APP_RECAPTCHA_KEY
export const REACT_APP_TINY_MCE_API_KEY = publicRuntimeConfig.REACT_APP_TINY_MCE_API_KEY