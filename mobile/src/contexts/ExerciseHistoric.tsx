import { ExerciseHistoric } from "@storage/exercise/ExerciseHistoric";
import { exerciseHistoricAll } from "@storage/exercise/exerciseHistoricAll";
import { exerciseHistoricCreate } from "@storage/exercise/exerciseHistoricCreate";
import { groupExerciseHistoricListByDate } from "@utils/groupExerciseHistoricListByDate";
import { createContext, ReactNode } from "react";

export type ExerciseHistoricProps = {
  date: string;
  data: ExerciseHistoric[];
}

export type ExerciseHistoricDataProps = {
  getExerciseHistoric: (exerciseId: string) => Promise<ExerciseHistoricProps[]>
  registerExerciseHistoric: (exercise: ExerciseHistoric) => Promise<void>
}

type ExerciseHistoricContextProviderProps = {
  children: ReactNode;
}

export const ExerciseHistoricContext = createContext({} as ExerciseHistoricDataProps);

export function ExerciseHistoricContextProvider ({children}: ExerciseHistoricContextProviderProps) {

  async function getExerciseHistoric(exerciseId: string) {
    const exerciseHistoric = await exerciseHistoricAll(exerciseId)
    const exerciseHistoricFormatted = groupExerciseHistoricListByDate(exerciseHistoric)
    return exerciseHistoricFormatted
  }

  async function registerExerciseHistoric(exerciseHistoric: ExerciseHistoric) {
    await exerciseHistoricCreate(exerciseHistoric)
  }

  return (
    <ExerciseHistoricContext.Provider value={{getExerciseHistoric, registerExerciseHistoric}}>
      {children}
    </ExerciseHistoricContext.Provider>
  )
}