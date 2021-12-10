// 스쿼트 샘플 데이터는 아래의 링크를 참고한다
// https://docs.google.com/spreadsheets/d/1fEC4_kmxEmDLiQl5C1mrH32BDGnKoHjVzx7b_Yl3jVU/edit#gid=1952706202
import { TargetPose } from '@library/mediapipe/consts';

// 스쿼트에서 서있는 자세 (팔짱끼고 있음)
const TARGET_POSE_SQUAT_0 : TargetPose = {
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
const TARGET_POSE_SQUAT_1 : TargetPose = {
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

export const TARGET_POSE_SQUAT = [TARGET_POSE_SQUAT_1, TARGET_POSE_SQUAT_0];

export const MESSAGE_SQUAT = ['두 발을 어깨 너비로 벌리고 팔짱 낀 채 천천히 앉으세요', '천천히 일어나세요'];
