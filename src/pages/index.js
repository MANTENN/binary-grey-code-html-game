import React, { useState, useRef } from "react"
import { Link } from "gatsby"
import CreatableSelect from "react-select/creatable"

import clamp from "lodash-es/clamp"
import { useSpring, animated, Transition } from "react-spring"
import { useDrag, rubberbandIfOutOfBounds } from "react-use-gesture"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const log = console.log
const buttonStyles =
  "p-4 px-6 bg-blue-700 hover:bg-blue-600 text-white rounded-lg hover:bg-blue-500"

function decimalToHexString(number) {
  if (number < 0) {
    number = 0xffffffff + number + 1
  }

  return number.toString(16).toUpperCase()
}

const IndexPage = () => {
  const index = useRef(0)
  const [bits, setNumberOfBits] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const itemWidth = "40"
  const [props, set] = useSpring(i => ({
    x: i * itemWidth,
    sc: 1,
    display: "block",
  }))

  const bind = useDrag(
    ({
      down,
      active,
      delta: [xDelta],
      direction: [xDir],
      distance,
      cancel,
      movement: [mx],
      tap,
    }) => {
      if (tap) return false
      log("drag")
      // if (down && active && distance > window / 2)
      //   cancel(
      //     (index.current = clamp(
      //       index.current + (xDir > 0 ? -1 : 1),
      //       0,
      //       bits.length - 1
      //     ))
      //   )
      set(i => {
        // if (i < index.current - 1 || i > index.current + 1)
        //   return { display: "none" }
        // const x = (i - index.current) * itemWidth + (down ? xDelta : 0)
        const x = down ? rubberbandIfOutOfBounds(mx, 0, 700) : 0
        console.log("mx", mx)
        const sc = down ? 1 - distance / itemWidth / 2 : 1
        return { x, sc, display: "block", immediate: down }
      })
    },
    {
      filterTaps: true,
      initial: () => [props.x.get(), 0],
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
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
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
    // if (parseInt(bits.join(""), 2))
    // if (focusIndex == index) {
    // ignore this fancy stuff
    const nextIndex = index + 1
    // if (
    //   bits[nextIndex < bits.length ? nextIndex : index] != 1 ||
    //   focusIndex == bits.length - 1
    // ) {
    const newBits = [...bits]
    newBits[index] = value == 1 ? 0 : 1
    setNumberOfBits(newBits)
    // }
    // } else {
    // moveFocusIndex(focusIndex >= index ? "left" : "right")
    // }
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
      <div className="text-center p-2">
        <h2 className="font-bold text-2xl mt-8 mb-1">Base Ten Number</h2>
        <span className="block font-bold text-4xl mb-6">
          {parseInt(bits.join(""), 2)}
        </span>
        <h2 className="font-bold text-2xl mt-8 mb-1">Base 16 Number</h2>
        <span className="block font-bold text-4xl mb-6">
          {decimalToHexString(parseInt(bits.join(""), 2))}
        </span>
      </div>
      <div
        className={"relative container mx-auto my-5 p-5 bg-red-200 rounded-lg "}
      >
        <div
          className={
            "relative flex row justify-center p-4 bg-orange-200 rounded-lg "
          }
        >
          <animated.div
            className="relative flex row justify-center select-none cursor-move z-10"
            {...bind()}
            style={{ x: props.x, touchAction: "none" }}
          >
            {bits.map((_, i) => (
              <animated.div
                key={i}
                className={`relative text-lg sm:text-2xl md:text-4xl lg:text-4xl col rounded-full flex items-center align-center h-20 w-20 md:p-6 z-10`}
              >
                <animated.span onClick={() => toggleItem(bits[i], i)}>
                  {bits[i]}
                </animated.span>
              </animated.div>
            ))}
          </animated.div>
        </div>
        <div className="absolute z-0 h-full top-0 right-0 flex items-center">
          <div className="block h-16 w-16 right-0 -mr-8 col rounded-full bg-blue-400 p-3 md:p-6" />
        </div>
      </div>
      <div className="p-4 bg-blue-200 rounded mb-6">
        You can use touch gestures to interact or your mouse intead of the
        buttons.
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
