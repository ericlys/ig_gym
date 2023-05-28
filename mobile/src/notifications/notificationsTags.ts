import OneSignal from "react-native-onesignal";

type addTagsProps = {
  userName: string
  email: string
}

export function tagUserInfo({userName, email}: addTagsProps){
  OneSignal.sendTags({
    'user_name': userName,
    'user_email': email
  })
}

export function tagLastExerciseHistoryTime() {
  OneSignal.sendTag('last_exercise', Math.floor(Date.now() / 1000).toString())
}

export function tagWeeklyExercisesAmount(amount: number) {
  OneSignal.sendTag('w_ex_amount', amount.toString())
}