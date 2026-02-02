import "./main.sass"
import {Arrays, isInstanceOf, Terminator} from "@opendaw/lib-std"
import {createElement, Frag, replaceChildren} from "@opendaw/lib-jsx"
import {AnimationFrame, Events} from "@opendaw/lib-dom"
import {Slide} from "./Slide"
import {TapeJson} from "./TapeJson"

window.name = "main"

;(async () => {
        console.debug("booting...")
        AnimationFrame.start()
        console.debug("booted")
        const lifecycle = new Terminator()
        const colors = [
            "var(--color-blue)",
            "var(--color-purple)",
            "var(--color-green)",
            "var(--color-orange)",
            "var(--color-red)",
            "var(--color-yellow)"]
        const TapesData: ReadonlyArray<TapeJson> = await fetch(`./mixes.json?v=${Date.now()}`)
            .then(response => response.json())
        const audioElements = TapesData.map(data => (
            <audio src={data.audio.toString()} crossOrigin="true"/>))
        lifecycle.own(Events.subscribe(window, "ended", event => {
            if (isInstanceOf(event.target, HTMLAudioElement)) {
                Arrays.getNext(audioElements, event.target).play()
            }
        }, {capture: true}))
        const slides: ReadonlyArray<HTMLElement> = TapesData.map((data, index) => (
            <Slide lifecycle={lifecycle}
                   data={data}
                   audio={audioElements[index]}
                   color={colors[index % colors.length]}/>))

        const toggleMenu = () => {
            menu.classList.toggle("open")
            backdrop.classList.toggle("open")
        }
        const closeMenu = () => {
            menu.classList.remove("open")
            backdrop.classList.remove("open")
        }
        const selectTape = (index: number) => {
            closeMenu()
            slides[index].scrollIntoView({behavior: "smooth"})
        }

        const menuItems: ReadonlyArray<HTMLButtonElement> = TapesData.map((data, index) => (
            <button style={{color: colors[index]}} onclick={() => selectTape(index)}>
                {data.name}
            </button>
        ))
        lifecycle.own(Events.subscribe(window, "play", (event: Event) => {
            if (isInstanceOf(event.target, HTMLAudioElement)) {
                audioElements.forEach((audio, index) => {
                    if (event.target === audio) {
                        menuItems[index].classList.add("playing")
                    } else {
                        menuItems[index].classList.remove("playing")
                        audio.pause()
                    }
                })
            }
        }, {capture: true}))

        const plusButton: HTMLButtonElement = (
            <button className="plus-button" onclick={toggleMenu}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
                </svg>
            </button>
        )
        const menu: HTMLDivElement = (
            <div className="tape-menu">
                {menuItems}
            </div>
        )
        const backdrop: HTMLDivElement = (
            <div className="menu-backdrop" onclick={closeMenu}/>
        )

        replaceChildren(document.body, (
            <Frag>
                {plusButton}
                {menu}
                {backdrop}
                {slides}
            </Frag>
        ))
    }
)()