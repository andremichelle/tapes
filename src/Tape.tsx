import css from "./Tape.sass?inline"
import {Arrays, Circle, clamp, Geom, Lifecycle, ObservableValue, ValueMapping} from "@opendaw/lib-std"
import {createElement, Frag} from "@opendaw/lib-jsx"
import {Html} from "@opendaw/lib-dom"

const className = Html.adoptStyleSheet(css, "Tape")

const cassetteWidthInCm = 10
const cassetteWidthInPixels = 208
const tapeSpeedInCmPerSecond = 4.76
const tapeVelocity = cassetteWidthInPixels / tapeSpeedInCmPerSecond / cassetteWidthInCm
const radiusEmpty = 15
const radiusFull = 38
const stroke = "var(--color-dark)"
const mapping = ValueMapping.linear(radiusEmpty, radiusFull)
const reels: ReadonlyArray<Circle> = [{x: 56, y: 44, r: 0}, {x: 152, y: 44, r: 0}]
const pins: ReadonlyArray<Readonly<Circle>> = [{x: 8, y: 104, r: 6}, {x: 200, y: 104, r: 6}]
const tapePath = [reels[0], pins[0], pins[1], reels[1]]
const tapeReelHub = (): SVGPathElement => (
    <g>
        <line x1={+mapping.y(0.4)} x2={+mapping.y(0.6)} stroke="rgba(255, 255, 255, 0.125)"
              stroke-width={4}
              stroke-linecap="round"/>
        <line x1={-mapping.y(0.4)} x2={-mapping.y(0.6)} stroke="rgba(255, 255, 255, 0.125)"
              stroke-width={4}
              stroke-linecap="round"/>
        <path fill="none" stroke={"var(--color-green)"} transform="translate(-10.4 -11.979)"
              d="M4.75,17.657C2.414,18.046 0.202,18.32 0.017,18C-0.167,17.68 1.168,15.91 2.669,14.086C2.486,13.415 2.388,12.708 2.388,11.979C2.388,8.263 4.922,5.135 8.355,4.23C9.182,2.028 10.042,0 10.409,0C10.778,0 11.64,2.031 12.467,4.236C15.889,5.148 18.413,8.271 18.413,11.979C18.413,12.702 18.317,13.404 18.136,14.07C19.642,15.9 20.986,17.68 20.802,18C20.616,18.321 18.395,18.046 16.053,17.655C14.604,19.098 12.605,19.991 10.4,19.991C8.196,19.991 6.199,19.099 4.75,17.657Z"/>
    </g>
)

export type Construct = {
    lifecycle: Lifecycle
    position: ObservableValue<number>
}

export const Tape = ({lifecycle, position}: Construct) => {
    const reelHubs: ReadonlyArray<SVGGraphicsElement> = [tapeReelHub(), tapeReelHub()]
    const reelElements: ReadonlyArray<SVGCircleElement> = reels.map(reel =>
        (<circle cx={reel.x} cy={reel.y} r={0} fill="rgba(0,0,0,0.08)" stroke={stroke}/>))
    const head: SVGElement = (
        <rect x={100} y={106} width={8} height={2} stroke="none" fill="var(--color-dark)"/>
    )
    const tape: ReadonlyArray<SVGLineElement> = Arrays.create(() => <line stroke={stroke}/>, 3)
    const total = 45 * 60
    const angles = [0.0, 0.0]
    let lastTime = 0.0
    let delta = 0.0
    const observer = (owner: ObservableValue<number>) => {
        const position = owner.getValue()
        const elapsed = position - lastTime
        delta += elapsed
        const ratio = clamp(delta / total, 0.0, 1.0)
        const ratios = [1.0 - ratio, ratio]
        for (let i = 0; i < 2; i++) {
            const reel = reels[i]
            const radius = mapping.y(ratios[i])
            angles[i] += (elapsed * 360) * (tapeVelocity / radius)
            reelHubs[i].setAttribute("transform", `translate(${reel.x}, ${reel.y}) rotate(${-angles[i] + i * 60.0})`)
            reelElements[i].r.baseVal.value = reel.r = radius
        }
        for (let i = 0; i < tapePath.length - 1; i++) {
            const [a, b] = Geom.outerTangentPoints(tapePath[i], tapePath[i + 1])
            const {x1, y1, x2, y2} = tape[i]
            x1.baseVal.value = a.x
            y1.baseVal.value = a.y
            x2.baseVal.value = b.x
            y2.baseVal.value = b.y
        }
        lastTime = position
    }
    lifecycle.own(position.catchupAndSubscribe(observer))
    return (
        <svg classList={className} viewBox="0 0 208 112"
             width={208}
             height={112}
             preserveAspectRatio="xMidYMin meet">
            {reels.map(reel => (
                <Frag>
                    <circle cx={reel.x} cy={reel.y} r={(radiusEmpty + radiusFull) >> 1}
                            fill="none"
                            stroke="hsl(200, 9%, 20%)"
                            stroke-width={radiusFull - radiusEmpty}/>
                    <circle cx={reel.x} cy={reel.y} r={radiusEmpty - 1} fill="none" stroke={"var(--color-blue)"}/>
                </Frag>
            ))}
            {reelElements}
            {reelHubs}
            {pins.map(({x, y, r}) => (<circle cx={x} cy={y} r={r} fill="none" stroke={stroke}/>))}
            {head}
            {tape}
        </svg>
    )
}