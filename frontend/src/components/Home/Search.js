import React, {Component, Fragment} from "react"
import {pure} from "recompose"
import classnames from "classnames"

class Search extends Component {
    constructor(props) {
        super(props)
        this.checkingVideoInfoStarted = false
        this.cancelCheckingVideoInfo = null
    }

    state = {
        q: "",
        errorMessage: null,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isChecking && !this.checkingVideoInfoStarted) {
            this.startCheckingVideoInfo()
        } else if (!this.props.isChecking && this.checkingVideoInfoStarted) {
            this.stopCheckingVideoInfo()

            if (
                this.props.taskStatus === "SUCCESS" &&
                this.props.taskResult !== null &&
                this.props.taskResult.error
            ) {
                this.setState({
                    errorMessage: this.props.taskResult.error_message
                })
            }
        }
    }

    startCheckingVideoInfo = () => {
        this.checkingVideoInfoStarted = true
        const {cancelCheckingVideoInfo} = this.props.startCheckingVideoInfo(this.props.taskId)
        this.cancelCheckingVideoInfo = cancelCheckingVideoInfo
    }

    stopCheckingVideoInfo = () => {
        this.checkingVideoInfoStarted = false
        if (this.cancelCheckingVideoInfo !== null) {
            this.cancelCheckingVideoInfo()
            this.cancelCheckingVideoInfo = null
        }
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.getVideoInfo(this.state.q)
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
        if (this.state.errorMessage !== null) {
            this.setState({errorMessage: null})
        }
    }

    render() {
        const {errorMessage} = this.state
        return (
            <Fragment>
                <h2 className="text-center">Enter YouTube URL:</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <div className="input-group">
                            <input
                                type="text"
                                className={classnames("form-control border-info", {"is-invalid": errorMessage})}
                                name="q"
                                required
                                onChange={this.onChange}
                                value={this.state.q}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-info" type="submit">Search</button>
                            </div>
                            <div className="invalid-feedback">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                </form>
            </Fragment>
        )
    }
}


export default pure(Search)
