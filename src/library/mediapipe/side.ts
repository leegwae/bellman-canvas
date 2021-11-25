// 옆구리 샘플 데이터는 아래의 링크를 참고한다.
// https://docs.google.com/spreadsheets/d/1fEC4_kmxEmDLiQl5C1mrH32BDGnKoHjVzx7b_Yl3jVU/edit#gid=0
import { TargetPose } from '@library/mediapipe/consts';

export const TARGET_POSE_SIDE_0 : TargetPose = {
  code: 'TARGET_POSE_SIDE_0',
  similarityGoal: 0.04,
  signature: [
    { id: 0, value: 0.169 },
    { id: 1, value: 0.162 },
    { id: 2, value: 0.5898 },
    { id: 3, value: 0.1056 },
    { id: 4, value: 0.3626 },
    { id: 5, value: 0.2204 },
    // { id: 6, value: 0.5104 },
    // { id: 7, value: 0.0962 },
    // { id: 8, value: 0.3204 },
    { id: 9, value: 0.2012 },
    { id: 10, value: 0.307 },
    // { id: 11, value: 0.1886 },
  ],
};

export const TARGET_POSE_SIDE_1 : TargetPose = {
  code: 'TARGET_POSE_SIDE_1',
  similarityGoal: 0.03,
  signature: [
    { id: 0, value: 0.184 },
    { id: 1, value: 0.0852 },
    // { id: 2, value: 0.42 },
    { id: 3, value: 0.1054 },
    { id: 4, value: 0.3788 },
    { id: 5, value: 0.4326 },
    // { id: 6, value: 0.7284 },
    { id: 7, value: 0.0752 },
    { id: 8, value: 0.334 },
    { id: 9, value: 0.1636 },
    { id: 10, value: 0.1878 },
    { id: 11, value: 0.1776 },
  ],
};

export const TARGET_POSE_SIDE = [TARGET_POSE_SIDE_0, TARGET_POSE_SIDE_1];
export const MESSAGE_SIDE = ['오른쪽 팔을 들고 허리를 왼쪽으로 굽히세요', '왼쪽 팔을 들고 오른쪽으로 허리를 굽히세요'];
