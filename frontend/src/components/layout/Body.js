import React from "react"
import {Route, Switch} from "react-router-dom"

import PrivateRoute from "../../containers/common/PrivateRoute"
import Home from "../pages/Home"
import LoginContainer from "../../containers/pages/LoginContainer"


const Body = () => (
    <Switch>
        <PrivateRoute exact path="/" component={Home}/>
        <Route exact path="/login/" component={LoginContainer}/>
        <Route exact path="/register/" component={() => <span>register</span>}/>
    </Switch>
)


export default Body
