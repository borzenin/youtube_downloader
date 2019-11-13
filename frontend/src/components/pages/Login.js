import React, {Component} from "react"
import {Link, Redirect} from "react-router-dom"
import classnames from "classnames"


export class Login extends Component {
    state = {
        username: "",
        password: "",
        loginStarted: false,
    }

    componentDidMount() {
        this.props.setErrors("login", null)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errors !== this.props.errors && this.state.loginStarted) {
            this.setState({password: "", loginStarted: false})
        }
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.login(this.state.username, this.state.password)
        this.setState({loginStarted: true})
    }

    onChange = e => {
        const field = e.target.name
        const {errors} = this.props
        if (errors != null && (errors[field] || errors.wrongCredentials)) {
            const {wrongCredentials, ...updatedErrors} = errors
            delete updatedErrors[field]
            this.props.setErrors("login", updatedErrors)
        }
        this.setState({[e.target.name]: e.target.value})
    }

    getErrors = () => {
        const errors = this.props.errors || {}
        return {
            username: errors.username || [],
            password: errors.password || [],
            wrongCredentials: errors.wrongCredentials || [],
        }
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        const {username, password} = this.state
        const errors = this.getErrors()

        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Login</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="text-danger ml-3">
                            <ul>
                                {errors.wrongCredentials.map((error, index) => <li key={index}>{error}</li>)}
                            </ul>
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                className={classnames("form-control", {"is-invalid": errors.username.length})}
                                name="username"
                                onChange={this.onChange}
                                value={username}
                            />
                            <div className="invalid-feedback">
                                <ul>
                                    {errors.username.map((error, index) => <li key={index}>{error}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className={classnames("form-control", {"is-invalid": errors.password.length})}
                                name="password"
                                onChange={this.onChange}
                                value={password}
                            />
                            <div className="invalid-feedback">
                                <ul>
                                    {errors.password.map((error, index) => <li key={index}>{error}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                        <p>
                            Don't have an account? <Link to="/register/">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login
