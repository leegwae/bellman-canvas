import { TARGET_POSE_SQUAT, MESSAGE_SQUAT } from '@library/mediapipe/squat';
import { TARGET_POSE_SIDE, MESSAGE_SIDE } from '@library/mediapipe/side';
import { TARGET_POSE_BREATHING, MESSAGE_BREATHING } from '@library/mediapipe//breathing';

// pose landmarks https://google.github.io/mediapipe/images/mobile/pose_tracking_full_body_landmarks.png
// pose signiture https://google.github.io/mediapipe/images/mobile/pose_classification_pairwise_distances.png
export const POSE_SIGNITURE_POINTS = [
  { id: 0, a: 11, b: 15 },
  { id: 1, a: 12, b: 14 },
  { id: 2, a: 12, b: 28 },
  { id: 3, a: 14, b: 16 },
  { id: 4, a: 15, b: 16 },
  { id: 5, a: 15, b: 23 },
  { id: 6, a: 15, b: 27 },
  { id: 7, a: 23, b: 24 },
  { id: 8, a: 23, b: 27 },
  { id: 9, a: 24, b: 26 },
  { id: 10, a: 26, b: 28 },
  { id: 11, a: 27, b: 28 },
];

export interface PoseSignature {
  id: number;
  value: number;
}
export interface TargetPose {
  code: string;
  similarityGoal: number;
  signature: PoseSignature[];
}
export interface PoseDifference {
  id: number;
  value: number;
}

interface ExerciseDictionary {
  [exercise: string]: string;
}
export const EXERCISE_DICT: ExerciseDictionary = {
  squat: '스쿼트',
  side: '옆구리 운동',
  breathing: '숨쉬기 운동',
};

interface ExercisePose {
  [exercise: string]: TargetPose[];
}
export const EXERCISE_POSE: ExercisePose = {
  squat: TARGET_POSE_SQUAT,
  side: TARGET_POSE_SIDE,
  breathing: TARGET_POSE_BREATHING,
};

interface ExerciseMessage {
  [exercise: string]: string[];
}
export const EXERCISE_MESSAGE: ExerciseMessage = {
  squat: MESSAGE_SQUAT,
  side: MESSAGE_SIDE,
  breathing: MESSAGE_BREATHING,
};
