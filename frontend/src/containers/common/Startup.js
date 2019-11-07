import React, {Component} from "react"
import {connect} from "react-redux"

import {checkAuth, syncTime} from "../../actions/auth"


class Startup extends Component {
    componentDidMount() {
        this.props.syncTime()
            .then(() => this.props.checkAuth())
    }

    render() {
        return this.props.children
    }
}

export default connect(
    null,
    {syncTime, checkAuth}
)(Startup)
