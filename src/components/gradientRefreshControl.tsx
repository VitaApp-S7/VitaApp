import * as React from "react"
import { RefreshControl, RefreshControlProps } from "react-native"

function GradientRefreshControl(props: RefreshControlProps) {
  return (
    <>
      <RefreshControl {...props}></RefreshControl>
    </>
  )
}

export default GradientRefreshControl
