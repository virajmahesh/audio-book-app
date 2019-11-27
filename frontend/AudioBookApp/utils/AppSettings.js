export const API_URL = 'http://34.83.56.29:8089/';
export const HOME_API_ENDPOINT = API_URL + 'home/{0}';
export const CHAPTER_API_ENDPOINT = API_URL + 'book/{0}/chapters';
export const SOCIAL_AUTH_API_ENDPOINT = API_URL + 'auth/custom-social-auth';


// Authentication URLs
export const AUTH_CLIENT_ID = 'oaxFPKB4OmSpT4vyzmEn5mmi8zkPN0Coo6egpGqJ';
export const AUTH_CLIENT_SECRET = 'MPYQAkzeCa2sHsEGTiocSKOn5nWiC2F0Vw85oajyJuouCgdg1OlhuAJLDilzVWHEqXQQkwQBbjSUf4Gr9unaThRcVbo2l7kNqhnF0xkI4E6zkIdHZlWVybcEozz2YQKV';

export const Google = {
    ANDROID_CLIENT_ID_DEV: '41859677974-olkepi5nsldshd211qomoftfemkn0ncn.apps.googleusercontent.com',
    ANDROID_CLIENT_ID_PROD: '41859677974-e63uqmukhu08aj7lb9egjd1np3icsail.apps.googleusercontent.com',
    IOS_CLIENT_ID_DEV: '41859677974-nf6uv4van5ftdcr6gnl0l73uh6ff0a10.apps.googleusercontent.com',
    IOS_CLIENT_ID_PROD: ''
};

// App Icon
export const APP_ICON_PATH = './assets/icon.png';

// Google Logo
export const GOOGLE_LOGO_PATH = './assets/google-logo.png';
export const GOOGLE_LOGO_URL = 'https://developers.google.com/identity/images/g-logo.png';

// Colors
export const BLUE_TINT = '#0074CD';
export const GREY_TINT = '#D7D7D7';
export const GREY = '#9C9C9C';

// Segment API Keys
export const Segment = {
    ANDROID_WRITE_KEY: 'p48UvsnHs4E8D0QtTTdaehdhW2v9t3m1',
    IOS_WRITE_KEY: 'YE0AnTwlHdlMSAXLeYJSM4CvtT9KKLBE'
};

export const Amplitude = {
    API_KEY: 'b70517afb8281e3d69223a1a996e9740'
};

// Deprecated
const OPEN_LIBRARY_IMAGE_URL = 'http://covers.openlibrary.org/b/isbn/';
const GOODREADS_REGEX_MATCH = /\._(SY|SX)(\d+)_\./gm;
