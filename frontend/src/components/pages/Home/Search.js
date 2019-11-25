import React, {Component, Fragment} from "react"
import {pure} from "recompose"


class Search extends Component {
    state = {
        q: "",
    }

    onSubmit = e => {
        e.preventDefault()
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        return (
            <Fragment>
                <h2 className="text-center">Enter YouTube URL:</h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control border-info"
                                name="q"
                                required
                                onChange={this.onChange}
                                value={this.state.q}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-info" type="submit">Search</button>
                            </div>
                        </div>
                    </div>
                </form>
            </Fragment>
        )
    }
}


export default pure(Search)
