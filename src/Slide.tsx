import css from "./Slide.sass?inline"
import {AnimationFrame, Html} from "@opendaw/lib-dom"
import {DefaultObservableValue, Lifecycle} from "@opendaw/lib-std"
import {createElement} from "@opendaw/lib-jsx"
import {Tape} from "./Tape"
import {TapeData} from "./TapeData"

const className = Html.adoptStyleSheet(css, "Slide")

type Construct = {
    lifecycle: Lifecycle
    data: TapeData
}

export const Slide = ({lifecycle, data}: Construct) => {
    const position = new DefaultObservableValue(0.0)
    AnimationFrame.add(() => position.setValue(performance.now() / 1000.0))
    return (
        <div className={className}>
            <h1>{data.name}</h1>
            <h2>{data.date}</h2>
            <Tape lifecycle={lifecycle} position={position}/>
            <p>{data.description}</p>
        </div>
    )
}