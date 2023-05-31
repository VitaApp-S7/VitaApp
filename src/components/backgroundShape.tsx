import * as React from "react"
import { Dimensions } from "react-native"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

function BackgroundShape(props) {
  return (
    <Svg
      width={Dimensions.get("screen").width}
      height={500}
      preserveAspectRatio="never"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0
      }}
    >
      <Path
        d="M.102-.033H393V257c0 3.033-273.429 91.797-392.898 72.882V-.033z"
        fill="url(#paint0_linear_191_957)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_191_957"
          x1={-10.5}
          y1={9.50004}
          x2={665}
          y2={205}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FEA419" />
          <Stop offset={0.502294} stopColor="#FFC242" />
          <Stop offset={1} stopColor="#FFDF6A" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default BackgroundShape
