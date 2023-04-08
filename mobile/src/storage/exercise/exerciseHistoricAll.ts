import AsyncStorage from '@react-native-async-storage/async-storage'
import { EXERCISE_STORAGE } from '@storage/storageConfig'
import { ExerciseHistoric } from './ExerciseHistoric'

export async function exerciseHistoricAll(exerciseId: string, userId: string){
  try {
    const storage = await AsyncStorage.getItem(`${EXERCISE_STORAGE}:${userId}:${exerciseId}`)

    const exerciseHistoric:ExerciseHistoric[] = storage ? JSON.parse(storage) : []

    return exerciseHistoric
  }catch (error) {
    throw error
  }

}