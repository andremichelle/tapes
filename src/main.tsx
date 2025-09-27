import "./main.sass"
import {DefaultObservableValue, panic, Terminator} from "@opendaw/lib-std"
import {createElement, replaceChildren} from "@opendaw/lib-jsx"
import {Tape} from "./Tape"
import {AnimationFrame} from "@opendaw/lib-dom"

window.name = "main"

;(async () => {
        if (!window.crossOriginIsolated) {return panic("window must be crossOriginIsolated")}
        console.debug("booting...")
        AnimationFrame.start()
        const position = new DefaultObservableValue(0.0)
        AnimationFrame.add(() => position.setValue(performance.now()))
        position.setValue(performance.now())
        console.debug(
            "booted",
            position
        )
        replaceChildren(document.body, (
            <div>
                <Tape lifecycle={new Terminator()} position={position}/>
            </div>
        ))
    }
)()