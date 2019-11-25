import React from "react"
import {pure} from "recompose"


const Result = () => (
    <table className="table mt-3 mb-0">
        <thead className="thead-light">
        <tr>
            <th scope="col">Type</th>
            <th scope="col">Extension</th>
            <th scope="col">Quality</th>
            <th scope="col">Download</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><span role="img" aria-label="Audio">&#x1f3b5;</span></td>
            <td>mp3</td>
            <td>low</td>
            <td><button type="button" className="btn btn-success btn-sm">Download</button></td>
        </tr>
        <tr>
            <td><span role="img" aria-label="Video">&#x1F3AC;</span></td>
            <td>mp4</td>
            <td>720x1080</td>
            <td><button type="button" className="btn btn-success btn-sm">Download</button></td>
        </tr>
        </tbody>
    </table>
)

export default pure(Result)
