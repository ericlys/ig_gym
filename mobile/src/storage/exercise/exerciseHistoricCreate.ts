import AsyncStorage from '@react-native-async-storage/async-storage'
import { ExerciseHistoric } from './ExerciseHistoric';
import { EXERCISE_STORAGE } from '@storage/storageConfig'
import { exerciseHistoricAll } from './exerciseHistoricAll';

export async function exerciseHistoricCreate( newExerciseHistoric: ExerciseHistoric, userId: string) {
  try {
    const storage = await exerciseHistoricAll(newExerciseHistoric.exerciseId, userId);

    const newStorage = JSON.stringify([newExerciseHistoric,...storage])

    await AsyncStorage.setItem(`${EXERCISE_STORAGE}:${userId}:${newExerciseHistoric.exerciseId}`, newStorage)
  }catch (error) {
    throw error
  }
}