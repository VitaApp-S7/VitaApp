import React from "react"
import { View, StyleSheet } from "react-native"

const filters: {
  category: string
  categoryId: string
  icon: string
} = [
  {
    category: "Mentaal",
    categoryId: "6409a7ec55514771765d8bb8",
    icon: ""
  },
  {
    category: "Sociaal",
    categoryId: "6409a7ec55514771765d8bb7",
    icon: ""
  },
  {
    category: "Fysiek",
    categoryId: "6409a7ec55514771765d8bb6",
    icon: ""
  },
  {
    category: "All",
    categoryId: null,
    icon: ""
  }
]

const MoodBoosterFilters = () => {
  const filterButton = () => {
    return <View></View>
  }

  return <View></View>
}

export default MoodBoosterFilters

const styles = StyleSheet.create({})
