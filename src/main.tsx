import "./main.sass"
import {Arrays, isInstanceOf, Terminator} from "@opendaw/lib-std"
import {createElement, Frag, replaceChildren} from "@opendaw/lib-jsx"
import {AnimationFrame, Events} from "@opendaw/lib-dom"
import {Slide} from "./Slide"
import {TapeData} from "./TapeData"

window.name = "main"

const TapesData: ReadonlyArray<TapeData> = [{
        name: "Port",
        date: "July, 31st 2025",
        description: "Mostly driving noises. Just delicious crispy tracks.",
        audio: new URL("https://www.andremichelle.io/files/mixes/Port.mp3"),
        duration: 5093.904375
    }, {
        name: "Deep Space Radio I",
        date: "May, 21st 2025",
        description: "Addicted-2-Bass / Episode 109",
        audio: new URL("https://www.andremichelle.io/files/mixes/DeepSpaceRadio.mp3"),
        duration: 3600
    }, {
        name: "Meadow",
        date: "May, 21st 2025",
        description: "Melodic techno, lush textures.",
        audio: new URL("https://www.andremichelle.io/files/mixes/Meadow.mp3"),
        duration: 3726.72
    }]

;(async () => {
        console.debug("booting...")
        AnimationFrame.start()
        console.debug("booted")
        const lifecycle = new Terminator()
        const audioElements = TapesData.map(data => (<audio src={data.audio.toString()} crossOrigin="true"/>))
        lifecycle.own(Events.subscribe(window, "ended", event => {
            if (isInstanceOf(event.target, HTMLAudioElement)) {
                Arrays.getNext(audioElements, event.target).play()
            }
        }, {capture: true}))
        const slides: ReadonlyArray<HTMLElement> = TapesData.map((data, index) => {
            const audio: HTMLAudioElement = audioElements[index]
            lifecycle.own(Events.subscribe(window, "play", event => {
                if (isInstanceOf(event.target, HTMLAudioElement)) {
                    if (event.target === audio) {
                        slides[index].scrollIntoView({behavior: "smooth"})
                    } else {
                        audio.pause()
                    }
                }
            }, {capture: true}))
            return (<Slide lifecycle={lifecycle} data={data} audio={audio}/>)
        })
        replaceChildren(document.body, (
            <Frag>
                {slides}
            </Frag>
        ))
    }
)()