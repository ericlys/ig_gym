import { ExerciseHistoric } from "@storage/exercise/ExerciseHistoric";
import { exerciseHistoricAll } from "@storage/exercise/exerciseHistoricAll";
import { exerciseHistoricCreate } from "@storage/exercise/exerciseHistoricCreate";
import { exerciseHistoricDelete } from "@storage/exercise/exerciseHistoricDelete";
import { groupExerciseHistoricListByDate } from "@utils/groupExerciseHistoricListByDate";
import { createContext, ReactNode } from "react";

export type ExerciseHistoricProps = {
  date: string;
  data: ExerciseHistoric[];
}

export type ExerciseHistoricDataProps = {
  getExerciseHistoric: (exerciseId: string) => Promise<ExerciseHistoricProps[]>
  registerExerciseHistoric: (exercise: ExerciseHistoric) => Promise<void>
  deleteExerciseHistoric: (id: string, exerciseId: string) => Promise<void>
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

  async function deleteExerciseHistoric(id: string, exerciseId: string) {
    try {
      await exerciseHistoricDelete(id, exerciseId);
    } catch (error) {
      console.log('err:', error)
    }
  }

  return (
    <ExerciseHistoricContext.Provider value={{getExerciseHistoric, registerExerciseHistoric, deleteExerciseHistoric}}>
      {children}
    </ExerciseHistoricContext.Provider>
  )
}