import { ExerciseHistoric } from "@storage/exercise/ExerciseHistoric"
import { dateFormatter } from "./formatters"

function convertToDateTime(dataString: string) {
  const [day, month, year] = dataString.split('/')
  return new Date(`${year}-${month}-${day}`).getTime()
}

export const groupExerciseHistoricListByDate = (exerciseHistoric: ExerciseHistoric[] ) => {

  const mealsGroupedByDate =  exerciseHistoric.reduce((acc, item) => {    
    const date = dateFormatter(new Date(item.date), '/')
    
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {} as Record<string, ExerciseHistoric[]>) 

  const result = Object.keys(mealsGroupedByDate)
    .map((date) => {
      return  {
        date,
        data: mealsGroupedByDate[date],
      }
    }).sort((a, b) =>  convertToDateTime(b.date) - convertToDateTime(a.date))

  return result
}