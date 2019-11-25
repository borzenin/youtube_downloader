import {connect} from "react-redux"
import {checkVideoInfo, getVideoInfo} from "../actions/loader"
import Home from "../components/Home"


const mapStateToProps = state => ({
    ...state.videoInfo
})

export default connect(
    mapStateToProps,
    {getVideoInfo, checkVideoInfo}
)(Home)
