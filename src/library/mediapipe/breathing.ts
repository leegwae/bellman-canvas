// 숨쉬기 운동 샘플 데이터는 아래의 링크를 참고한다.
// https://docs.google.com/spreadsheets/d/1fEC4_kmxEmDLiQl5C1mrH32BDGnKoHjVzx7b_Yl3jVU/edit#gid=1160812454
import { TargetPose } from '@library/mediapipe/consts';

export const TARGET_POSE_BREATHING_0 : TargetPose = {
  code: 'TARGET_POSE_BREATHING_0',
  similarityGoal: 0.05,
  signature: [
    // { id: 0, value: 0.5412 },
    { id: 1, value: 0.2406 },
    { id: 2, value: 0.5606 },
    { id: 3, value: 0.3018 },
    { id: 4, value: 0.1474 },
    { id: 5, value: 0.6108 },
    { id: 6, value: 0.9368 },
    { id: 7, value: 0.068 },
    // { id: 8, value: 0.3634 },
    { id: 9, value: 0.1638 },
    { id: 10, value: 0.2394 },
    { id: 11, value: 0.053 },
  ],
};

export const TARGET_POSE_BREATHING_1 : TargetPose = {
  code: 'TARGET_POSE_BREATHING_1',
  similarityGoal: 0.03,
  signature: [
    { id: 0, value: 0.322 },
    { id: 1, value: 0.1528 },
    { id: 2, value: 0.628 },
    { id: 3, value: 0.1588 },
    { id: 4, value: 0.1526 },
    // { id: 5, value: 0.5736 },
    // { id: 6, value: 0.954 },
    { id: 7, value: 0.0636 },
    { id: 8, value: 0.3824 },
    { id: 9, value: 0.1734 },
    { id: 10, value: 0.2266 },
    { id: 11, value: 0.0408 },
  ],
};

export const TARGET_POSE_BREATHING_2 : TargetPose = {
  code: 'TARGET_POSE_BREATHING_2',
  similarityGoal: 0.04,
  signature: [
    { id: 0, value: 0.206 },
    { id: 1, value: 0.081 },
    // { id: 2, value: 0.672 },
    { id: 3, value: 0.128 },
    { id: 4, value: 0.456 },
    { id: 5, value: 0.437 },
    // { id: 6, value: 0.799 },
    { id: 7, value: 0.061 },
    { id: 8, value: 0.387 },
    { id: 9, value: 0.167 },
    { id: 10, value: 0.231 },
    { id: 11, value: 0.054 },
  ],
};

export const TARGET_POSE_BREATHING_3 : TargetPose = {
  code: 'TARGET_POSE_BREATHING_3',
  similarityGoal: 0.05,
  signature: [
    { id: 0, value: 0.2078 },
    { id: 1, value: 0.1302 },
    { id: 2, value: 0.6304 },
    { id: 3, value: 0.127 },
    { id: 4, value: 0.1446 },
    { id: 5, value: 0.1768 },
    { id: 6, value: 0.586 },
    { id: 7, value: 0.0648 },
    { id: 8, value: 0.4354 },
    { id: 9, value: 0.1626 },
    { id: 10, value: 0.2626 },
    // { id: 11, value: 0.1272 },
  ],
};

export const TARGET_POSE_BREATHING = [
  TARGET_POSE_BREATHING_0,
  TARGET_POSE_BREATHING_1,
  TARGET_POSE_BREATHING_2,
  TARGET_POSE_BREATHING_3,
];

export const MESSAGE_BREATHING = [
  '두 팔을 앞으로 쭉 내미세요',
  '두 팔을 수직으로 쭉 들어올리세요',
  '두 팔을 내려 일자가 되게 하세요.',
  '편안하게 두 팔을 허리 옆으로 내려놓으세요',
];
