import React, { useState } from "react"

interface MoodPointsContextType {
  moodPoints: number
  setMoodPoints: (moodPoints: number) => void
}
export const MoodPointsContext = React.createContext<MoodPointsContextType>({
  moodPoints: 0,
  setMoodPoints: () => null
})

const MoodPointsProvider = (props: any) => {
  const [ moodPoints, setMoodPoints ] = useState(10)

  return (
    <MoodPointsContext.Provider
      value={{
        moodPoints,
        setMoodPoints
      }}
    >
      {props.children}
    </MoodPointsContext.Provider>
  )
}

export default MoodPointsProvider
