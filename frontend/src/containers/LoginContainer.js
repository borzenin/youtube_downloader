import {connect} from "react-redux"
import {login} from "../actions/auth"
import Login from "../components/Login"
import {setErrors} from "../actions/errors"


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.errors.login,
})

export default connect(
    mapStateToProps,
    {login, setErrors}
)(Login)
