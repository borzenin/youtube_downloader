import React from "react"
import Search from "./Search"
import Preview from "./Preview"
import Result from "./Result"


const Home = () => (
    <div className="col-md-6 mx-auto">
        <Search/>
        <Preview/>
        <Result/>
    </div>
)

export default Home
