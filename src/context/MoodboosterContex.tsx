// import React, {
//   PropsWithChildren,
//   useContext,
//   useEffect,
//   useMemo,
//   useState
// } from "react"
// import { AppContext } from "./AppContext"
// import {
//   getAllActiveActivities,
//   getAllActivities,
//   startActivity
// } from "../services/moodboosterService"
// import { MoodboosterType, UserMoodboosterType } from "../types/MoodboosterTypes"

// interface MoodboosterContextType {
//   moodboosters: UserMoodboosterType[]
//   refresh: () => void
//   start: (id: string) => Promise<void>
//   cancel: (id: string) => Promise<void>
//   finish: (id: string) => Promise<void>
// }

// export const MoodboosterContext = React.createContext<MoodboosterContextType>({
//   moodboosters: null,
//   refresh: () => Promise.resolve(),
//   start: () => null,
//   cancel: () => null,
//   finish: () => null
// })

// export const MoodboosterProvider = (props: PropsWithChildren) => {
//   const [ moodboosters, setMoodboosters ] = useState<UserMoodboosterType[]>(null)
//   const { accessToken } = useContext(AppContext)

//   //TOAST AFTER COMPLETE
//   const refresh = async () => {
//     const userMoodboosters: UserMoodboosterType[] =
//       await getAllActiveActivities(accessToken)
//     const moodboosters: MoodboosterType[] = await getAllActivities(accessToken)
//     userMoodboosters.push(...moodboosters.map((mb) => ({ moodbooster: mb })))

//     setMoodboosters(userMoodboosters)
//     return Promise.resolve()
//   }

//   const start = async (moodboosterId: string) => {
//     const userMoodbooster : UserMoodboosterType = await startActivity(moodboosterId, accessToken)
//     Object.assign(moodboosters.find((mb) => mb.moodbooster.id == moodboosterId), userMoodbooster)
//     //setMoodboosters()
//   }

//   // const cancel = async (id: string) => {

//   // }
//   // const finish = async (id: string) => {

//   // }

//   const state = useMemo<MoodboosterContextType>(() => {
//     return {
//       moodboosters,
//       refresh,
//       start,
//       cancel,
//       finish
//     }
//   }, [ moodboosters ])

//   useEffect(() => {
//     refresh()
//   }, [])

//   return (
//     <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
//   )
// }
