import AsyncStorage from '@react-native-async-storage/async-storage'
import { EXERCISE_STORAGE } from '@storage/storageConfig'
import { exerciseHistoricAll } from './exerciseHistoricAll';

export async function exerciseHistoricDelete( id: string, exerciseId: string, userId: string) {
  try {
    const storage = await exerciseHistoricAll(exerciseId, userId);

    const newStorageWithoutDeletedExercise = storage.filter( exercise => exercise.id !== id);

    const newStorage = JSON.stringify(newStorageWithoutDeletedExercise)

    await AsyncStorage.setItem(`${EXERCISE_STORAGE}:${userId}:${exerciseId}`, newStorage)
  }catch (error) {
    throw error
  }
}