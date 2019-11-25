import React from "react"
import {pure} from "recompose"
import "./styles.css"


const Preview = () => {

    const spinner = (
        <div className="mt-3 d-flex justify-content-center">
            <div className="spinner"/>
        </div>
    )

    return (
        true ? spinner :
            <div className="card card-body mt-3 border border-secondary">
                <div className="media">
                    <img src="https://assets.pernod-ricard.com/nz/media_images/test.jpg" className="mr-3 w-25" alt="video_preview_image"/>
                    <div className="media-body">
                        <h5 className="mt-0">Media heading Media heading</h5>
                        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras
                        purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
                        vulputate fringilla. Donec lacinia congue felis in faucibus.
                    </div>
                </div>
            </div>
    )
}


export default pure(Preview)
