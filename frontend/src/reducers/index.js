import {combineReducers} from "redux"
import auth from "./auth"
import errors from "./errors"
import videoInfo from "./videoInfo"

export default combineReducers({
    auth, errors, videoInfo
})
