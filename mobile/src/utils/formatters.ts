export function dateFormatter(date: Date, separator = '.') {
  if(date) {
    const day = ('0' + date.getDate()).slice(-2)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()
    const dateFormatted = `${day}${separator}${month}${separator}${year}`
    
    return dateFormatted
  }
  return ''
}

export function timeFormatter(time: Date) {
  if(time) {
    const hour = ('0' + time.getHours()).slice(-2)
    const minutes = ('0' + time.getMinutes()).slice(-2)
    const timeFormatted = `${hour}:${minutes}`
    return timeFormatted
  }
  return ''
}

