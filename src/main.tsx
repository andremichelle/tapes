import "./main.sass"
import {panic, Terminator} from "@opendaw/lib-std"
import {createElement, Frag, replaceChildren} from "@opendaw/lib-jsx"
import {AnimationFrame} from "@opendaw/lib-dom"
import {Slide} from "./Slide"
import {TapeData} from "./TapeData"

window.name = "main"

const TapesData: ReadonlyArray<TapeData> = [{
        name: "Port",
        date: "July, 31st 2025",
        description: "Mostly driving noises. Just delicious crispy tracks.",
        audio: new URL("https://www.andremichelle.io/files/mixes/Port.mp3")
    }, {
        name: "Deep Space Radio I",
        date: "May, 21st 2025",
        description: "Addicted-2-Bass / Episode 109",
        audio: new URL("https://www.andremichelle.io/files/mixes/DeepSpaceRadio.mp3")
    }, {
        name: "Meadow Minimal",
        date: "May, 21st 2025",
        description: "Melodic techno, balancing lush textures.",
        audio: new URL("https://www.andremichelle.io/files/mixes/Meadow.mp3")
    }]

;(async () => {
        if (!window.crossOriginIsolated) {return panic("window must be crossOriginIsolated")}
        console.debug("booting...")
        AnimationFrame.start()
        console.debug("booted")
        const terminator = new Terminator()
        replaceChildren(document.body, (
            <Frag>
                {TapesData.map(data => <Slide lifecycle={terminator} data={data}/>)}
            </Frag>
        ))
    }
)()