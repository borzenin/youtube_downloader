import urljoin from "url-join"


// Generic
export const API_URL = process.env.REACT_APP_API_URL


// Endpoints
export const TOKEN_OBTAIN_URL = urljoin(API_URL, "accounts/token/obtain/")
export const TOKEN_REFRESH_URL = urljoin(API_URL, "accounts/token/refresh/")
export const TOKEN_DESTROY_URL = urljoin(API_URL, "accounts/token/destroy/")

export const REGISTER_URL = urljoin(API_URL, "accounts/register/")

export const VIDEO_INFO_URL = urljoin(API_URL, "loader/info/")
