import React, {Component} from "react"
import {BrowserRouter} from "react-router-dom"

import Body from "./layout/Body"
import {Provider} from "react-redux"
import store from "../store"

import HeaderContainer from "../containers/layout/HeaderContainer"

import Startup from "../containers/common/Startup"


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Startup>
                    <BrowserRouter>
                        <div className="min-vh-100 bg-light">
                            <HeaderContainer/>
                            <Body/>
                        </div>
                    </BrowserRouter>
                </Startup>
            </Provider>
        )
    }
}

export default App
