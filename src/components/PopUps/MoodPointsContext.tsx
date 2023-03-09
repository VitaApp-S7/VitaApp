import React, { useState, useContext, useEffect } from "react"

import { AuthContext } from "../../context/AuthContext"

interface MoodPointsContextType {
  moodPoints: number
  setMoodPoints: (moodPoints: number) => void
}
export const MoodPointsContext = React.createContext<MoodPointsContextType>({
  moodPoints: 0,
  setMoodPoints: () => null
})

const MoodPointsProvider = (props: any) => {
  const { user } = useContext(AuthContext)
  const [ moodPoints, setMoodPoints ] = useState(10)

  useEffect(() => {
    if(user !== undefined && user !== null){
      setMoodPoints(user.mood)
    }
  }, [user])

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
