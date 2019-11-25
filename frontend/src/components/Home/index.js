import React from "react"
import Search from "./Search"
import Preview from "./Preview"
import Result from "./Result"


const Home = ({getVideoInfo, checkVideoInfo, isLoading, taskId, taskStatus, taskResult}) => (
    <div className="col-md-6 mx-auto">
        <Search {...{getVideoInfo, checkVideoInfo, taskId, taskStatus, taskResult}} />
        <Preview {...{isLoading, taskResult}} />
        <Result {...{taskResult}} />
    </div>
)

export default Home
