export default function parseDate(dateString: string) {
  const date = new Date(dateString)

  const day = date.getDate()
  const month = date.toLocaleString("en-US", { month: "long" })
  const year = date.toLocaleString("en-US", { year: "numeric" })

  return `${day} ${month.slice(0, 3).toUpperCase()} ${year} `
}
