import React, {Component, Fragment} from "react"
import {Link, withRouter} from "react-router-dom"


class Header extends Component {
    onLoginButtonPressed = () => this.props.history.push("/login/")
    onRegisterButtonPressed = () => this.props.history.push("/register/")

    render() {
        const loginRegisterButtons = (
            <Fragment>
                <li className="nav-item px-1">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onLoginButtonPressed}
                    >Login
                    </button>
                </li>
                <li className="nav-item px-1">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={this.onRegisterButtonPressed}
                    >Register
                    </button>
                </li>
            </Fragment>
        )

        const logoutButton = (
            <li className="nav-item">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.props.logout}
                >Logout
                </button>
            </li>
        )

        return (
            <nav className="navbar navbar-expand navbar-light" style={{backgroundColor: "rgb(114,192,204)"}}>
                <div className="container">
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link to="/" className="nav-link">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about/" className="nav-link">
                                    About
                                </Link>
                            </li>
                            {
                                this.props.isAuthenticated ? (
                                    <li className="nav-item">
                                        <Link to="/history/" className="nav-link">
                                            History
                                        </Link>
                                    </li>
                                ) : false
                            }
                        </ul>

                        <ul className="navbar-nav ml-auto">
                            <span className="nav-item my-auto mr-2">{this.props.username}</span>
                            {this.props.isAuthenticated ? logoutButton : loginRegisterButtons}
                        </ul>

                    </div>
                </div>
            </nav>
        )
    }
}

export default withRouter(Header)
