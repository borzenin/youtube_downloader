import {CREATE_TASK, TASK_CREATION_FAILURE, TASK_CREATION_SUCCESS, TASK_FINISHED} from "../actions/loader"


const initialState = {
    isLoading: false,
    isChecking: false,
    taskId: null,
    taskStatus: null,
    taskResult: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_TASK:
            return {
                ...state,
                isLoading: true,
                isChecking: false
            }
        case TASK_CREATION_SUCCESS:
            return {
                ...state,
                isLoading: true,
                isChecking: true,
                taskId: action.payload.task_id,
                taskStatus: action.payload.task_status,
                taskResult: null
            }
        case TASK_FINISHED:
            return {
                ...state,
                isLoading: false,
                isChecking: false,
                taskId: action.payload.taskId,
                taskStatus: action.payload.taskStatus,
                taskResult: action.payload.taskResult
            }
        case TASK_CREATION_FAILURE:
            return {
                ...state,
                isLoading: false,
                isChecking: false,
                taskId: null,
                taskStatus: null,
                taskResult: null,
            }
        default:
            return state
    }
}
