import jwt from "jsonwebtoken"
import axios from "axios"
import {TOKEN_REFRESH_URL} from "../config"


const getCurrentTime = () => (
    Date.now() / 1000 + parseInt(sessionStorage.getItem("timedelta"))
)

export const delay = ms => (
    new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
)

export const defaultConfig = () => (
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
)

export const isTokenExpired = token => {
    const payload = jwt.decode(token, {json: true})
    return payload.exp < getCurrentTime() + 10
}

export const getNewAccessToken = (refreshToken) => {
    const body = JSON.stringify({refresh: refreshToken})
    return axios
        .post(TOKEN_REFRESH_URL, body, defaultConfig())
        .then(res => {
            return res.data
        })
}

export const axiosWithAuth = async (method, url, config, data = null) => {
    let accessToken = localStorage.getItem("access_token")

    if (accessToken == null || isTokenExpired(accessToken)) {
        const refreshToken = localStorage.getItem("refresh_token")
        try {
            const {access, refresh} = await getNewAccessToken(refreshToken)
            localStorage.setItem("access_token", access)
            localStorage.setItem("refresh_token", refresh)
            accessToken = access
        } catch (e) {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            return window.location.replace("/login/")
        }
    }
    config.headers["Authorization"] = `Bearer ${accessToken}`

    if (["get", "delete", "head"].includes(method)) {
        return axios[method](url, config)
    } else if (["post", "put", "patch"].includes(method)) {
        return axios[method](url, data, config)
    }
}
