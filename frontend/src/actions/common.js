import jwt from "jsonwebtoken"


const getCurrentTime = () => (
    Date.now() / 1000 + parseInt(sessionStorage.getItem("timedelta"))
)


export const defaultConfig = () => (
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
)

export const tokenConfig = token => {
    // Headers
    const config = defaultConfig()

    // If token, add to headers config
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
}

export const isTokenExpired = token => {
    const payload = jwt.decode(token, {json: true})
    console.log(payload, getCurrentTime())
    return payload.exp < getCurrentTime()
}
