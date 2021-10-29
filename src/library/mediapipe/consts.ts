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

// 스쿼트에서 서있는 자세 (팔짱끼고 있음)
export const TARGET_POSE_SQUAT_0 : TargetPose = {
  code: 'TARGET_POSE_SQUAT_0',
  similarityGoal: 0.03,
  signature: [
    // { id: 0, value: 0.3725 },
    { id: 1, value: 0.2065 },
    { id: 2, value: 0.6812 },
    { id: 3, value: 0.2060 },
    { id: 4, value: 0.0555 },
    { id: 5, value: 0.4562 },
    // { id: 6, value: 0.7880 },
    { id: 7, value: 0.1695 },
    { id: 8, value: 0.3935 },
    { id: 9, value: 0.2037 },
    { id: 10, value: 0.2410 },
    { id: 11, value: 0.2062 },
  ],
};
// 스쿼트에서 앉은 자세
export const TARGET_POSE_SQUAT_1 : TargetPose = {
  code: 'TARGET_POSE_SQUAT_1',
  similarityGoal: 0.05,
  signature: [
    // { id: 0, value: 0.3284 }, // disabled due to high noise
    { id: 1, value: 0.211 },
    { id: 2, value: 0.4562 },
    { id: 3, value: 0.1932 },
    { id: 4, value: 0.0334 },
    // { id: 5, value: 0.6064 }, // disabled due to high noise
    { id: 6, value: 0.6204 },
    { id: 7, value: 0.0806 },
    { id: 8, value: 0.2676 },
    { id: 9, value: 0.3434 },
    { id: 10, value: 0.248 },
    { id: 11, value: 0.1972 },
  ],
};
