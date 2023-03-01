import React, { useContext, useState } from "react"

const MoodPointsContext = React.createContext()
const MoodUpdateContext = React.createContext()

export function useMoodPoints() {
  return useContext(MoodPointsContext)
}

export function useMoodPointsUpdate() {
  return useContext(MoodUpdateContext)
}

export function MoodProvider({ children }) {
  const [ points, SetPoints ] = useState(10)



  return (
    <MoodPointsContext.Provider value={points} >
      <MoodUpdateContext.Provider value={SetPoints}>
        {children}
      </MoodUpdateContext.Provider>
    </MoodPointsContext.Provider>
  )
}

