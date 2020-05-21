import React, { useState, useRef } from "react"
import { Link } from "gatsby"
import CreatableSelect from "react-select/creatable"

import clamp from "lodash-es/clamp"
import { useSprings, animated } from "react-spring"
import { useGesture } from "react-use-gesture"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const log = console.log
const buttonStyles =
  "p-4 px-6 bg-blue-700 text-white rounded-lg hover:bg-blue-500"

const IndexPage = () => {
  const index = useRef(0)
  const [bits, setNumberOfBits] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const itemWidth = "40"
  const [props, set] = useSprings(bits.length, i => ({
    x: i * itemWidth,
    sc: 1,
    display: "block",
  }))

  const bind = useGesture(
    ({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
      if (down && distance > itemWidth / 2)
        cancel(
          (index.current = clamp(
            index.current + (xDir > 0 ? -1 : 1),
            0,
            bits.length - 1
          ))
        )
      set(i => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: "none" }
        const x = (i - index.current) * itemWidth + (down ? xDelta : 0)
        const sc = down ? 1 - distance / itemWidth / 2 : 1
        return { x, sc, display: "block" }
      })
    }
  )

  const options = [
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
  ]
  const [selectedOption, setSelectedOption] = useState(options[6])
  const handleSelectChange = selectedOption => {
    const newBits = new Array(parseInt(selectedOption.value)).fill(0)
    setNumberOfBits(newBits)
    setFocusIndex(newBits.length - 2)
    setSelectedOption(selectedOption)
  }

  const [focusIndex, setFocusIndex] = useState(bits.length - 2)
  const toggleItem = (value, index) => {
    if (focusIndex == index) {
      const nextIndex = index + 1
      if (
        bits[nextIndex < bits.length ? nextIndex : index] != 1 ||
        focusIndex == bits.length - 1
      ) {
        const newBits = [...bits]
        newBits[index] = value == 1 ? 0 : 1
        setNumberOfBits(newBits)
      }
    } else {
      moveFocusIndex(focusIndex >= index ? "left" : "right")
    }
  }

  const moveFocusIndex = side => {
    let newFocusIndex = focusIndex
    if (side == "left") newFocusIndex = focusIndex - 1
    if (side == "right") newFocusIndex = focusIndex + 1
    const logic =
      bits[bits.length < newFocusIndex ? newFocusIndex : focusIndex] != 0 ||
      (bits[bits.length - 1] == 0 && focusIndex == bits.length - 1)
    if (
      (side == "left" && 0 <= newFocusIndex && logic) ||
      (side == "right" && bits.length > newFocusIndex)
    ) {
      setFocusIndex(newFocusIndex)
    }
  }

  return (
    <Layout>
      <SEO title="Binary Gray Code Game" />
      <CreatableSelect
        // isValidNewOption={e => console.log(e)}
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
      />
      <div className={"container mx-auto my-5 p-5 bg-red-200 rounded-lg "}>
        <div
          {...bind()}
          className={
            "flex row justify-center p-4 bg-orange-200 rounded-lg select-none"
          }
        >
          {props.map(({ x, display, sc }, i) => (
            <animated.div
              key={i}
              className={`text-lg sm:text-2xl md:text-4xl lg:text-4xl col rounded-full${
                i == focusIndex ? " bg-blue-400" : ""
              } p-3 md:p-6`}
              style={{
                display,
                transform: x.interpolate(x => `translate3d(${x}px,0,0)`),
              }}
            >
              <animated.span
                style={{
                  transform: sc.interpolate(s => `scale(${s})`),
                  backgroundImage: `url(${bits[i]})`,
                }}
                onClick={() => toggleItem(bits[i], i)}
              >
                {bits[i]}
              </animated.span>
            </animated.div>
          ))}
        </div>
      </div>
      <div className="flex row justify-center">
        <button className={buttonStyles} onClick={() => moveFocusIndex("left")}>
          Move Focus Left
        </button>
        <button
          className={"ml-2 " + buttonStyles}
          onClick={() => moveFocusIndex("right")}
        >
          Move Focus Right
        </button>
      </div>
    </Layout>
  )
}

export default IndexPage
