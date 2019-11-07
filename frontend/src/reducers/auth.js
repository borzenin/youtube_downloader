import {
    AUTH_FAIL,
    AUTH_SUCCESS,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    SYNC_TIME,
    SYNC_TIME_SUCCESS,
    SYNC_TIME_UNNECESSARY,
} from "../actions/auth"


const initialState = {
    isAuthenticated: false,
    isLoading: false,
    username: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SYNC_TIME:
            return {
                ...state,
                isLoading: true
            }
        case SYNC_TIME_SUCCESS:
            sessionStorage.setItem("timedelta", action.payload)
            return {
                ...state,
                isLoading: false
            }
        case AUTH_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                username: action.payload
            }
        case LOGIN_SUCCESS:
            localStorage.setItem("access_token", action.payload.accessToken)
            localStorage.setItem("refresh_token", action.payload.refreshToken)
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                username: action.payload.username
            }
        case AUTH_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                username: null
            }
        case SYNC_TIME_UNNECESSARY:
        default:
            return state
    }
}
