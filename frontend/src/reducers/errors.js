import {SET_ERRORS} from "../actions/errors"

const initialState = {
    register: null,
    login: null,
    videoInfo: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_ERRORS:
            const {tag, errors} = action.payload
            return {
                ...state,
                [tag]: JSON.parse(JSON.stringify(errors))
            }
        default:
            return state
    }
}
