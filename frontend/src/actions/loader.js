import {VIDEO_INFO_URL} from "../config"
import {axiosWithAuth, defaultConfig} from "./common"
import urljoin from "url-join"

export const CREATE_TASK = "CREATE_TASK_VIDEO_INFO"

export const TASK_CREATION_SUCCESS = "TASK_CREATION_SUCCESS_VIDEO_INFO"
export const TASK_CREATION_FAILURE = "TASK_CREATION_FAILURE_VIDEO_INFO"

export const TASK_CHECK_SUCCESS = "TASK_CHECK_SUCCESS_VIDEO_INFO"
export const TASK_CHECK_FAILURE = "TASK_CHECK_FAILURE_VIDEO_INFO"


export const getVideoInfo = (url) => dispatch => {
    dispatch({
        type: CREATE_TASK
    })
    const body = JSON.stringify({url})

    return axiosWithAuth("post", VIDEO_INFO_URL, defaultConfig(), body)
        .then(res => {
            dispatch({
                type: TASK_CREATION_SUCCESS,
                payload: res.data
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({type: TASK_CREATION_FAILURE})
        })
}

export const checkVideoInfo = (taskId) => dispatch => {
    return axiosWithAuth("get", urljoin(VIDEO_INFO_URL, taskId), defaultConfig())
        .then(res => {
            const {task_id, task_status, task_result} = res.data
            dispatch({
                type: TASK_CHECK_SUCCESS,
                payload: {
                    taskId: task_id,
                    taskStatus: task_status,
                    taskResult: task_result
                }
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({type: TASK_CHECK_FAILURE})
        })
}
