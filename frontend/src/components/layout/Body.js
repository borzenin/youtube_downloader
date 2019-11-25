import React from "react"
import {Route, Switch} from "react-router-dom"

import PrivateRoute from "../../containers/common/PrivateRoute"
import Home from "../pages/Home"
import LoginContainer from "../../containers/pages/LoginContainer"
import RegisterContainer from "../../containers/pages/RegisterContainer"


const Body = () => (
    <div className="my-0 py-3">
        <Switch>
            <PrivateRoute exact path="/" component={Home}/>
            <Route exact path="/login/" component={LoginContainer}/>
            <Route exact path="/register/" component={RegisterContainer}/>
        </Switch>
    </div>
)


export default Body
