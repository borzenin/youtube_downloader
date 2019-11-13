export const SET_ERRORS = "SET_ERRORS"

export const setErrors = (tag, errors) => dispatch => {
    dispatch({
        type: SET_ERRORS,
        payload: {tag, errors}
    })
}
