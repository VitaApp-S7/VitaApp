import { StyleProp, ViewStyle } from "react-native"
import { G, Path, Svg } from "react-native-svg"
import * as d3 from "d3-shape"
import React from "react"

export type Props = {
  widthAndHeight: number;
  series: number[];
  sliceColor: string[];
  coverFill?: string | null;
  coverRadius?: number;
  style?: StyleProp<ViewStyle>;
};

function minimumPercentage(series: number[]) {
  series = series.map(x => isNaN(x) ? 0 : x)
  const minimumPercentage = 3.5
  const tooLowPercentages = series.filter((x) => x < minimumPercentage)
  let addedPercentage = 0
  for (let i = 0; i < tooLowPercentages.length; i++) {
    const toAdd = minimumPercentage - tooLowPercentages[i]
    tooLowPercentages[i] += toAdd
    addedPercentage += toAdd
  }

  const highPercentages = series.filter((x) => x >= minimumPercentage)
  const highPercentagesTotal = highPercentages.reduce(
    (x, y) => x + y - minimumPercentage, 0
  )

  for (let i = 0; i < highPercentages.length; i++) {
    highPercentages[i] -=
      addedPercentage *
      ((highPercentages[i] - minimumPercentage) / highPercentagesTotal)
  }

  const resultPercentages = tooLowPercentages
    .concat(highPercentages)
    .sort((x, y) => y - x)

  console.log(series)
  console.log(resultPercentages)

  return resultPercentages
}

const PieChart = ({
  widthAndHeight,
  series,
  sliceColor,
  coverFill = null,
  coverRadius,
  style = {}
}: Props): JSX.Element => {
  const resultPercentages = minimumPercentage(series.map(s => s / series.reduce((x, y) => x + y) * 100))

  // Validating props
  resultPercentages.forEach((s) => {
    if (s <= 0) {
      throw Error(`Invalid series: all numbers should be positive. Found ${s}`)
    }
  })

  const sum = resultPercentages.reduce((previous, current) => previous + current, 0)
  if (sum <= 0) {
    throw Error("Invalid series: sum of series is zero")
  }

  if (sliceColor.length != resultPercentages.length) {
    throw Error(
      `Invalid "sliceColor": its length should be equal to the length of "series". sliceColor.length=${sliceColor.length} series.length=${resultPercentages.length}`
    )
  }

  if (coverRadius && (coverRadius < 0 || coverRadius > 1)) {
    throw Error(
      `Invalid "coverRadius": It should be between zero and one. But it's ${coverRadius}`
    )
  }

  const radius = widthAndHeight / 2

  const pieGenerator = d3.pie().sort(null)

  const arcs = pieGenerator(resultPercentages)

  return (
    <Svg style={style} width={widthAndHeight + 10} height={widthAndHeight + 10}>
      <G
        transform={`translate(${widthAndHeight / 2 + 5}, ${
          widthAndHeight / 2 + 5
        })`}
      >
        {arcs.map((arc, i) => {
          let arcGenerator = d3
            .arc()
            .cornerRadius(10)
            .outerRadius(radius)
            .startAngle(arc.startAngle)
            .endAngle(arc.endAngle)
            .padAngle(0.05)

          // When 'coverFill' is also provided, instead of setting the
          // 'innerRadius', we draw a circle in the middle. See the 'Path'
          // after the 'map'.
          if (!coverRadius) {
            arcGenerator = arcGenerator.innerRadius(0)
          } else {
            arcGenerator = arcGenerator.innerRadius(coverRadius * radius)
          }

          // TODO: Pad: "stroke": "black, "stroke-width": "2px"
          //       OR: use padAngle
          return (
            <Path
              key={arc.index}
              stroke={"#fff"}
              strokeWidth={4}
              fill={sliceColor[i]}
              d={arcGenerator()}
            />
          )
        })}

        {coverRadius && coverRadius > 0 && coverFill && (
          <Path
            key="cover"
            fill={coverFill}
            d={d3
              .arc()
              .outerRadius(coverRadius * radius)
              .innerRadius(0)
              .startAngle(0)
              .endAngle(360)()}
          />
        )}
      </G>
    </Svg>
  )
}

export default PieChart
