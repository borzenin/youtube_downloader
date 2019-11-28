import {VIDEO_INFO_URL} from "../config"
import {axiosWithAuth, defaultConfig} from "./common"
import urljoin from "url-join"

export const CREATE_TASK = "CREATE_TASK_VIDEO_INFO"

export const TASK_CREATION_SUCCESS = "TASK_CREATION_SUCCESS_VIDEO_INFO"
export const TASK_CREATION_FAILURE = "TASK_CREATION_FAILURE_VIDEO_INFO"

export const TASK_FINISHED = "TASK_FINISHED_VIDEO_INFO"


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

const checkVideoInfo = async (taskId) => {
    try {
        const result = await axiosWithAuth("get", urljoin(VIDEO_INFO_URL, taskId), defaultConfig())
        const isTaskFinished = ["SUCCESS", "FAILURE", "REVOKED"].includes(result.data.task_status)
        return {
            fetchError: false,
            isTaskFinished: isTaskFinished,
            taskId: result.data.task_id,
            taskStatus: result.data.task_status,
            taskResult: result.data.task_result
        }
    } catch (error) {
        return {
            fetchError: true,
            isTaskFinished: true,
            taskId: taskId,
            taskStatus: null,
            taskResult: null
        }
    }
}

export const startCheckingVideoInfo = (taskId) => dispatch => {
    let cancelled = false
    const promise = new Promise(async () => {
        while (true) {
            if (cancelled) return
            const result = await checkVideoInfo(taskId)
            if (result.isTaskFinished) {
                dispatch({
                    type: TASK_FINISHED,
                    payload: {
                        ...result
                    }
                })
                return
            }
            await new Promise(((resolve) => setTimeout(resolve, 800)))
        }
    })
    return {
        promise,
        cancelCheckingVideoInfo: () => {
            cancelled = true
        }
    }
}
