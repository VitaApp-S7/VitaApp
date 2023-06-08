import React, { ReactElement } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import CategoryFilterMentalIcon from "../../assets/categoryFilterMentalIcon.svg"
import CategoryFilterPhysicalIcon from "../../assets/categoryFilterPhysicalIcon.svg"
import CategoryFilterSocialIcon from "../../assets/categoryFilterSocialIcon.svg"
import MonsterFilled from "../../assets/monsterFilled.svg"
import { LinearGradient } from "expo-linear-gradient"

type categoryFilter = {
  category: string
  categoryId: string
  icon: ReactElement
}

const filters: categoryFilter[] = [
  {
    category: "All",
    categoryId: null,
    icon: <MonsterFilled />
  },
  {
    category: "Mentaal",
    categoryId: "6409a83055514771765d8bb8",
    icon: <CategoryFilterMentalIcon />
  },
  {
    category: "Sociaal",
    categoryId: "6409a81b55514771765d8bb7",
    icon: <CategoryFilterSocialIcon />
  },
  {
    category: "Fysiek",
    categoryId: "6409a7ec55514771765d8bb6",
    icon: <CategoryFilterPhysicalIcon />
  }
]

interface MoodBoosterFiltersProps {
  setFilter: (newState: string) => void
}

const MoodBoosterFilters = ({ setFilter }: MoodBoosterFiltersProps) => {
  const filterButton = (category: categoryFilter) => {
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
          style={styles.iconBtnBg}
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
        return filterButton(category)
      })}
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
    height: "100%",
    bottom: 0,
    opacity: 0.8,
    left: 0,
    borderRadius: 6
  }
})
