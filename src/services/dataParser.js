export default function parseDate(dateString) {
  // Parse the date string using the Date constructor
  const date = new Date(dateString)

  // Use the getDate method to get the day
  const day = date.getDate()

  // Use the toLocaleString method to get the month and year
  const month = date.toLocaleString("en-US", { month: "long" })
  const year = date.toLocaleString("en-US", { year: "numeric" })

  // Use the toLocaleString method to get the time
  // const time = date.toLocaleString("en-US", {
  //   hour: "2-digit",
  //   minute: "2-digit"
  // })

  // Use string formatting to add the "th"
  const formattedDate = `${day}${" "}${month
    .slice(0, 3)
    .toUpperCase()}${" "}${year} `

  return formattedDate
}
