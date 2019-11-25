import {
    CREATE_TASK,
    TASK_CHECK_FAILURE,
    TASK_CHECK_SUCCESS,
    TASK_CREATION_FAILURE,
    TASK_CREATION_SUCCESS
} from "../actions/loader"


const initialState = {
    isLoading: false,
    taskId: null,
    taskStatus: null,
    taskResult: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_TASK:
            return {
                ...state,
                isLoading: true
            }
        case TASK_CREATION_SUCCESS:
            return {
                ...state,
                taskId: action.payload.task_id,
                taskStatus: action.payload.task_status,
                taskResult: null
            }
        case TASK_CHECK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                taskId: action.payload.taskId,
                taskStatus: action.payload.taskStatus,
                taskResult: action.payload.taskResult,
            }
        case TASK_CREATION_FAILURE:
        case TASK_CHECK_FAILURE:
            return {
                ...state,
                isLoading: false,
                taskId: null,
                taskStatus: null,
                videoInfo: null,
            }
        default:
            return state
    }
}
