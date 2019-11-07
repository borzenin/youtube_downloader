import React, {Component, Fragment} from "react"
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
                        <Fragment>
                            <HeaderContainer/>
                            <Body/>
                        </Fragment>
                    </BrowserRouter>
                </Startup>
            </Provider>
        )
    }
}

export default App
