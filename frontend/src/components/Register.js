import React, {Component} from "react"
import {Link, Redirect} from "react-router-dom"
import classnames from "classnames"


export class Register extends Component {
    state = {
        username: "",
        password: "",
        password2: "",
        registerStarted: false,
    }

    componentDidMount() {
        this.props.setErrors("register", null)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.errors !== this.props.errors && this.state.registerStarted) {
            this.setState({password: "", password2: "", registerStarted: false})
        }
    }

    onSubmit = e => {
        e.preventDefault()
        const {username, password, password2} = this.state
        if (password !== password2) {
            this.props.setErrors("register", {"password": ["Passwords do not match."]})
            return
        }
        this.props.register(username, password)
        this.setState({registerStarted: true})
    }

    onChange = e => {
        let field = e.target.name
        const {errors} = this.props
        if (field === "password2") field = "password"
        if (errors != null && errors[field]) {
            const updatedErrors = {...errors}
            delete updatedErrors[field]
            this.props.setErrors("register", updatedErrors)
        }

        this.setState({[e.target.name]: e.target.value})
    }

    getErrors = () => {
        const errors = this.props.errors || {}
        return {
            username: errors.username || [],
            password: errors.password || [],
        }
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        const {username, password, password2} = this.state
        const errors = this.getErrors()

        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-5">
                    <h2 className="text-center">Register</h2>
                    <form onSubmit={this.onSubmit}>
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
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className={classnames("form-control", {"is-invalid": errors.password.length})}
                                name="password2"
                                onChange={this.onChange}
                                value={password2}
                            />
                            <div className="invalid-feedback">
                                <ul>
                                    {errors.password.map((error, index) => <li key={index}>{error}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                        <p>
                            Already have an account? <Link to="/login/">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        )
    }
}

export default Register
