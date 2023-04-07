import { ExerciseHistoricContext } from "@contexts/ExerciseHistoric";
import { useContext } from "react";

export function useExerciseHistoric() {
  const context = useContext(ExerciseHistoricContext)

  return context;
}