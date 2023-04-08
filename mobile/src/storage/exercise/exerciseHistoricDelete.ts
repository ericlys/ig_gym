import AsyncStorage from '@react-native-async-storage/async-storage'
import { EXERCISE_STORAGE } from '@storage/storageConfig'
import { exerciseHistoricAll } from './exerciseHistoricAll';

export async function exerciseHistoricDelete( id: string, exerciseId: string ) {
  try {
    const storage = await exerciseHistoricAll(exerciseId)

    const newStorageWithoutDeletedExercise = storage.filter( exercise => exercise.id !== id);

    const newStorage = JSON.stringify(newStorageWithoutDeletedExercise)

    await AsyncStorage.setItem(`${EXERCISE_STORAGE}:${exerciseId}`, newStorage)
  }catch (error) {
    throw error
  }
}