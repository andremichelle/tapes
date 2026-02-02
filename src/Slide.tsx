import css from "./Slide.sass?inline"
import {Html} from "@opendaw/lib-dom"
import {Lifecycle} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {Tape} from "./Tape"
import {TapeJson} from "./TapeJson"

const className = Html.adoptStyleSheet(css, "Slide")

type Construct = {
    lifecycle: Lifecycle
    data: TapeJson
    color: string
    audio: HTMLAudioElement
}

export const Slide = ({lifecycle, data, color, audio}: Construct) => {
    return (
        <div className={className} style={{"--color": color}}>
            <h1>{data.name}</h1>
            <h2>{data.date}</h2>
            <Tape lifecycle={lifecycle} audio={audio} data={data}/>
            <p>{data.description}</p>
            {audio}
        </div>
    )
}