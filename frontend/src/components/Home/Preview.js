import React from "react"
import {pure} from "recompose"
import "./styles.css"


const Preview = ({isLoading, taskResult}) => {
    const spinner = (
        <div className="mt-3 d-flex justify-content-center">
            <div className="spinner"/>
        </div>
    )

    const showPreview = taskResult !== null && !taskResult.error

    return (
        isLoading ? spinner :
            showPreview ? (
                <div className="card card-body mt-3 border border-secondary">
                    <div className="media">
                        <img src={taskResult.preview} className="mr-3 w-25" alt="video_preview_image"/>
                        <div className="media-body">
                            <h5 className="mt-0"><a href={taskResult.url}>{taskResult.title}</a></h5>
                            {taskResult.uploader}
                            <br/>
                            <b>{taskResult.duration}</b>
                        </div>
                    </div>
                </div>
            ) : false
    )
}


export default pure(Preview)
