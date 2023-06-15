import * as React from "react"
import Svg, { Path, Defs, Stop, LinearGradient } from "react-native-svg"

function BackgroundShape(props) {
  return (
    <Svg
      width="100%"
      height={1009}
      preserveAspectRatio="xMinYMin slice"
      viewBox="0 0 393 809"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{
        position: "absolute",
        left: 0,
        top: -659,
        paddingBottom: 300
      }}
    >
      <Path
        d="M0 0h393v717c0 7.342-273.5 127.392-393 81.606V0z"
        fill="url(#paint0_linear_270_943)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_270_943"
          x1={-33}
          y1={206}
          x2={705.251}
          y2={305.366}
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
