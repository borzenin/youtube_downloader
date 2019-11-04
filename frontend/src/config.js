import urljoin from 'url-join'


// Generic
export const API_URL = process.env.REACT_APP_API_URL


// Endpoints
export const TOKEN_OBTAIN_URL = urljoin(API_URL, 'accounts/token/obtain')
export const TOKEN_REFRESH_URL = urljoin(API_URL, 'accounts/token/refresh')
