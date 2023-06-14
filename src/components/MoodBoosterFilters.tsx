import React, { ReactElement, useMemo } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import CategoryFilterMentalIcon from "../../assets/categoryFilterMentalIcon.svg"
import CategoryFilterPhysicalIcon from "../../assets/categoryFilterPhysicalIcon.svg"
import CategoryFilterSocialIcon from "../../assets/categoryFilterSocialIcon.svg"
import MonsterFilled from "../../assets/monsterFilled.svg"
import ChallengeIcon from "../../assets/challengeIcon.svg"
import { LinearGradient } from "expo-linear-gradient"
import { useActivitiesCompletedQuery } from "../queries/MoodboosterQueries"
import {
  useActiveChallengeQuery,
  useChallengesQuery
} from "../queries/ChallengeQueries"

type categoryFilter = {
  category: string
  categoryId: string
  icon: ReactElement
  maxPoints: number
}

const filters: categoryFilter[] = [
  {
    category: "All",
    categoryId: null,
    icon: <MonsterFilled />,
    maxPoints: 30
  },
  {
    category: "Mentaal",
    categoryId: "6409a83055514771765d8bb8",
    icon: <CategoryFilterMentalIcon />,
    maxPoints: 10
  },
  {
    category: "Sociaal",
    categoryId: "6409a81b55514771765d8bb7",
    icon: <CategoryFilterSocialIcon />,
    maxPoints: 10
  },
  {
    category: "Fysiek",
    categoryId: "6409a7ec55514771765d8bb6",
    icon: <CategoryFilterPhysicalIcon />,
    maxPoints: 10
  }
]

interface MoodBoosterFiltersProps {
  setFilter: (newState: string) => void
}

const MoodBoosterFilters = ({ setFilter }: MoodBoosterFiltersProps) => {
  const completedActivities = useActivitiesCompletedQuery()
  const activeChallenge = useActiveChallengeQuery()

  const dailyCompleted = useMemo(() => {
    const currentDate = new Date().toISOString().slice(0, 10)
    return completedActivities.data?.filter((activity) => {
      const activityDate = activity.completionDate?.toString().slice(0, 10)
      return activityDate == currentDate //"2023-04-05"
    })
  }, [ completedActivities ])

  const UserInChallenge = useMemo(() => {
    console.log("ACTIVE CHALLENGE:", activeChallenge)
    // console.log("CHALLENGE MOODBOOSTERS:", activeChallenge.data.moodboosterIds)
  }, [ activeChallenge ])

  const filterButton = (category: categoryFilter, points: number) => {
    return (
      <TouchableOpacity
        key={category.categoryId}
        style={[
          styles.iconBtn,
          category.category != "All"
            ? { shadowColor: "#072C40" }
            : { shadowColor: "#FF9900" }
        ]}
        onPress={() => setFilter(category.categoryId)}
      >
        <LinearGradient
          start={{
            x: 0,
            y: 0.5
          }} // Starts from the left side
          end={{
            x: 1,
            y: 0.5
          }}
          colors={
            category.category != "All"
              ? [ "#BCD8F2", "#8FC2F2" ]
              : [ "#FFDF6A", "#FEA419" ]
          }
          style={[
            styles.iconBtnBg,
            { height: `${Math.min((points / category.maxPoints) * 100, 100)}%` }
          ]}
        />

        {React.cloneElement(category.icon, {
          width: 30,
          height: 30
        })}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {filters.map((category: categoryFilter) => {
        const points = dailyCompleted
          ?.filter((mb) => mb.moodbooster.category.id === category.categoryId)
          .reduce((total, mb) => total + mb.moodbooster.points, 0)
        const pointsAll = dailyCompleted?.reduce(
          (total, mb) => total + mb.moodbooster.points,
          0
        )
        return filterButton(
          category,
          category.categoryId == null ? pointsAll : points
        )
      })}
      <TouchableOpacity
        style={{ marginLeft: "auto" }}
        onPress={() => setFilter("challenge")}
      >
        <ChallengeIcon
          width={55}
          height={55}
          style={{
            shadowOffset: {
              width: 0,
              height: 0
            },
            shadowColor: "#FF9900",
            shadowOpacity: 0.6,
            shadowRadius: 4,
            elevation: 3
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default MoodBoosterFilters

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    paddingHorizontal: 16,
    marginTop: -5,
    marginBottom: 7
  },
  iconBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: "white",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3
  },
  iconBtnBg: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    opacity: 0.8,
    left: 0,
    borderRadius: 6
  }
})
