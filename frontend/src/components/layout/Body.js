import React from "react"
import {Route, Switch} from "react-router-dom"

import PrivateRoute from "../../containers/common/PrivateRoute"
import HomeContainer from "../../containers/HomeContainer"
import LoginContainer from "../../containers/LoginContainer"
import RegisterContainer from "../../containers/RegisterContainer"


const Body = () => (
    <div className="my-0 py-3">
        <Switch>
            <PrivateRoute exact path="/" component={HomeContainer}/>
            <Route exact path="/login/" component={LoginContainer}/>
            <Route exact path="/register/" component={RegisterContainer}/>
        </Switch>
    </div>
)


export default Body
