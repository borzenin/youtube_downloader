import {connect} from "react-redux"
import {register} from "../actions/auth"
import Register from "../components/Register"
import {setErrors} from "../actions/errors"


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.errors.register,
})

export default connect(
    mapStateToProps,
    {register, setErrors}
)(Register)
