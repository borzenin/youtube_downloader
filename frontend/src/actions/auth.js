import axios from "axios"
import {REGISTER_URL, TOKEN_DESTROY_URL, TOKEN_OBTAIN_URL} from "../config"
import {defaultConfig, isTokenExpired} from "./common"
import jwt from "jsonwebtoken"
import {setErrors} from "./errors"

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS"

export const SYNC_TIME = "SYNC_TIME"
export const SYNC_TIME_SUCCESS = "SYNC_TIME_SUCCESS"
export const SYNC_TIME_UNNECESSARY = "SYNC_TIME_UNNECESSARY"

export const AUTH_SUCCESS = "AUTH_SUCCESS"
export const AUTH_FAIL = "AUTH_FAIL"


export const syncTime = () => dispatch => {
    if (sessionStorage.getItem("timedelta")) {
        dispatch({type: SYNC_TIME_UNNECESSARY})
        return new Promise((resolve => resolve()))
    }

    dispatch({type: SYNC_TIME})
    return axios
        .options(document.location, defaultConfig())
        .then(res => {
            const timedelta = Math.floor((Date.parse(res.headers.date) - Date.now()) / 1000)
            dispatch({
                type: SYNC_TIME_SUCCESS,
                payload: Math.abs(timedelta) < 10 ? "0" : timedelta.toString()
            })
        })
        .catch(error => console.log(error))

}

// Time must be synced
export const checkAuth = () => dispatch => {
    const refreshToken = localStorage.getItem("refresh_token")
    const isAuthenticated = refreshToken != null && !isTokenExpired(refreshToken)

    if (isAuthenticated) {
        dispatch({
            type: AUTH_SUCCESS,
            payload: jwt.decode(refreshToken, {json: true}).username
        })
    } else {
        dispatch({type: AUTH_FAIL})
    }
}

export const login = (username, password) => dispatch => {
    const body = JSON.stringify({username, password})

    return axios
        .post(TOKEN_OBTAIN_URL, body, defaultConfig())
        .then(res => {
            const {access, refresh} = res.data
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    accessToken: access,
                    refreshToken: refresh,
                    username: jwt.decode(refresh, {json: true}).username
                }
            })
        })
        .catch(error => {
            if (!error.response) {
                console.log(error)
                return
            }
            const {data} = error.response
            const loginErrors = data.detail ? {wrongCredentials: [data.detail]} : data
            dispatch(setErrors("login", loginErrors))
        })
}

export const register = (username, password) => dispatch => {
    const body = JSON.stringify({username, password})

    return axios
        .post(REGISTER_URL, body, defaultConfig())
        .then(res => {
            dispatch(login(username, password))
        })
        .catch(error => {
            if (!error.response) {
                console.log(error)
                return
            }
            dispatch(setErrors("register", error.response.data))
        })
}

export const logout = () => dispatch => {
    const refresh = localStorage.getItem("refresh_token")

    const body = JSON.stringify({refresh})
    return axios
        .post(TOKEN_DESTROY_URL, body, defaultConfig())
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS
            })
        })
        .catch(error => console.log(error))
}
