import "./main.sass"
import {Arrays, isInstanceOf, Terminator} from "@opendaw/lib-std"
import {createElement, Frag, replaceChildren} from "@opendaw/lib-jsx"
import {AnimationFrame, Events} from "@opendaw/lib-dom"
import {Slide} from "./Slide"
import {TapeData} from "./TapeData"

window.name = "main"

const TapesData: ReadonlyArray<TapeData> = [{
        name: "Distant",
        date: "Oct, 10st 2025",
        description: "Addicted-2-Bass / Episode 144",
        audio: new URL("https://www.andremichelle.io/files/mixes/Distant.mp3"),
        duration: 3722.331
    },{
        name: "Port",
        date: "July, 31st 2025",
        description: "Mostly driving noises. Just delicious crisp tracks.",
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
        const colors = ["var(--color-blue)", "var(--color-purple)", "var(--color-green)"]
        const audioElements = TapesData.map(data => (
            <audio src={data.audio.toString()} crossOrigin="true"/>))
        lifecycle.own(Events.subscribe(window, "ended", event => {
            if (isInstanceOf(event.target, HTMLAudioElement)) {
                Arrays.getNext(audioElements, event.target).play()
            }
        }, {capture: true}))
        const slides: ReadonlyArray<HTMLElement> = TapesData.map((data, index) => (
            <Slide lifecycle={lifecycle} data={data} audio={audioElements[index]} color={colors[index]}/>))
        const buttons: ReadonlyArray<HTMLButtonElement> = TapesData.map((data, index) => (
            <button style={{color: colors[index]}} onclick={() => slides[index].scrollIntoView({behavior: "smooth"})}>
                {data.name}
            </button>
        ))
        lifecycle.own(Events.subscribe(window, "play", (event: Event) => {
            if (isInstanceOf(event.target, HTMLAudioElement)) {
                audioElements.forEach((audio, index) => {
                    if (event.target === audio) {
                        buttons[index].classList.add("playing")
                        slides[index].scrollIntoView({behavior: "smooth"})
                    } else {
                        buttons[index].classList.remove("playing")
                        audio.pause()
                    }
                })
            }
        }, {capture: true}))
        replaceChildren(document.body, (
            <Frag>
                <div className="buttons">
                    <Frag>
                        <svg viewBox="2 2 20 20" fill="var(--color-shadow)" style={{width: "1.5vw"}}>
                            <path
                                d="M10.8293 13C10.9398 12.6872 11 12.3506 11 12C11 10.3431 9.65685 9 8 9C6.34315 9 5 10.3431 5 12C5 13.6569 6.34315 15 8 15H16C17.6569 15 19 13.6569 19 12C19 10.3431 17.6569 9 16 9C14.3431 9 13 10.3431 13 12C13 12.3506 13.0602 12.6872 13.1707 13H10.8293ZM3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13ZM8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12C9 12.5523 8.55228 13 8 13Z"/>
                        </svg>
                        {buttons}
                    </Frag>
                </div>
                {slides}
            </Frag>
        ))
    }
)()