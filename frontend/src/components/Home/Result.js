import React, {Component} from "react"
import {pure} from "recompose"


class Result extends Component {
    onSubmit = (e) => {
        e.preventDefault()
        console.log(e.target["format_id"].value, this.props.taskResult.url)
    }

    render() {
        const {taskResult} = this.props
        const shouldRender = taskResult !== null && !taskResult.error

        return (
            shouldRender ? (
                <table className="table mt-3 mb-0">
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Extension</th>
                        <th scope="col">Quality</th>
                        <th scope="col">Size</th>
                        <th scope="col">Download</th>
                    </tr>
                    </thead>
                    <tbody>
                    {["high", "medium", "low"].map((val, index) => (
                        <tr key={index}>
                            <td><span role="img" aria-label="Audio">&#x1f3b5;</span></td>
                            <td>mp3</td>
                            <td>{val}</td>
                            <td/>
                            <td>
                                <form onSubmit={this.onSubmit}>
                                    <input type="hidden" name="format_id" value={"audio:" + val}/>
                                    <button type="submit" className="btn btn-success btn-sm">Download</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {taskResult.formats.map((format, index) => (
                        <tr key={index}>
                            <td><span role="img" aria-label="Video">&#x1F3AC;</span></td>
                            <td>{format.ext}</td>
                            <td>{format.format_note}</td>
                            <td>{format.filesize}</td>
                            <td>
                                <form onSubmit={this.onSubmit}>
                                    <input type="hidden" name="format_id" value={format.format_id}/>
                                    <button type="submit" className="btn btn-success btn-sm">Download</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : false
        )
    }
}

export default pure(Result)
