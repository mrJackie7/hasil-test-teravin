const randIdDate = () => {
  const date = new Date()
  const randID = (Math.random() + date.valueOf()).toString(36).substr(2, 4)
  const month =
    date.getMonth().toString().length === 1
      ? `0${date.getMonth()}`
      : date.getMonth()
  const year = date.getFullYear().toString().substr(-2)
  return `${year}${month}${randID}`
}

module.exports = randIdDate
