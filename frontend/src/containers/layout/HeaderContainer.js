import {connect} from "react-redux"
import Header from "../../components/layout/Header"
import {logout} from "../../actions/auth"


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    username: state.auth.username,
})

export default connect(
    mapStateToProps,
    {logout}
)(Header)
