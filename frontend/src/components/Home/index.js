import React from "react"
import Search from "./Search"
import Preview from "./Preview"
import Result from "./Result"


const Home = ({getVideoInfo, startCheckingVideoInfo, isLoading, isChecking, taskId, taskStatus, taskResult}) => (
    <div className="col-md-6 mx-auto">
        <Search {...{getVideoInfo, startCheckingVideoInfo, taskId, taskStatus, taskResult, isChecking}} />
        <Preview {...{isLoading, taskResult}} />
        <Result {...{taskResult}} />
    </div>
)

export default Home
