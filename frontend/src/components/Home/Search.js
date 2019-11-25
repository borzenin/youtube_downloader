import React, {Component, Fragment} from "react"
import {pure} from "recompose"
import classnames from "classnames"

class Search extends Component {
    state = {
        q: "",
        timer: null,
        errorMessage: null,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        switch (this.props.taskStatus) {
            case null:
                break
            case "SUCCESS":
                if (this.state.timer !== null) {
                    // TASK FINISHED
                    const {error, error_message} = this.props.taskResult
                    clearInterval(this.state.timer)
                    this.setState({
                        timer: null,
                        errorMessage: error ? error_message : null
                    })
                }
                break
            case "FAILURE":
            case "REVOKED":
                if (this.state.timer !== null) {
                    clearInterval(this.state.timer)
                    this.setState({timer: null})
                }
                break
            default:
                if (this.state.timer === null && this.props.taskId !== null) {
                    const timer = setInterval(this.checkVideoInfo, 1000)
                    this.setState({timer})
                }
                break
        }
    }

    checkVideoInfo = () => {
        this.props.checkVideoInfo(this.props.taskId)
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
