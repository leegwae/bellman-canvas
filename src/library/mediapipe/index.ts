import cameraUtils from '@mediapipe/camera_utils';
import Pose, { POSE_CONNECTIONS } from '@mediapipe/pose';

import utils from './utils';
import { PoseDifference, PoseSignature, TargetPose } from './consts';

// CurrentPose 부분
type CurrentPose = {
  raw: Pose.Results | undefined;
  hasPoseData: boolean;
  signature: PoseSignature[]
};
let CP: CurrentPose = {
  raw: undefined,
  hasPoseData: false,
  signature: [],
};

// Callback 부분
type onTargetPose = (targetPose: TargetPose, p : PoseDifference[]) => void
let targetPose: TargetPose | undefined;
let callbackPose: onTargetPose;

const OnPoseResult = async (result: Pose.Results) => {
  if (result.poseLandmarks === undefined) {
    CP = {
      raw: result,
      hasPoseData: false,
      signature: [],
    };
    return;
  }
  const signature = utils.getPoseSignature(result.poseLandmarks);
  if (targetPose !== undefined) {
    const diff = utils.calcuratePoseDiff(signature, targetPose);
    const similarity = diff.map((v) => v.value).reduce((prev, cur) => prev + cur);

    if (similarity < targetPose.similarityGoal) {
      callbackPose(targetPose, diff);
    }
  }
  CP = {
    raw: result,
    hasPoseData: true,
    signature,
  };
};

const setOnTargetPose = (pose: TargetPose, callback: onTargetPose) => {
  targetPose = pose;
  callbackPose = callback;
};
const resetOnTargetPose = () => {
  targetPose = undefined;
  callbackPose = () => {};
};

const GetCurrentPose = () => CP;

const Load = async (canvas : HTMLCanvasElement | undefined) => {
  // init cam element
  const camElem = document.createElement('video');

  // init pose
  const pose = new Pose.Pose({
    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${Pose.VERSION}/${file}`,
  });

  pose.setOptions({
    selfieMode: false,
    modelComplexity: 0,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  pose.onResults(async (p) => {
    // drawing debugging info
    if (canvas) {
      utils.drawDebugCanvas(canvas, p, targetPose);
    }
    // update Current Pose
    await OnPoseResult(p);
  });

  const cam = new cameraUtils.Camera(camElem, {
    onFrame: async () => {
      await pose.send({
        image: camElem,
      });
    },
  });

  await cam.start();
};

export * from './consts';
export default {
  Load, GetCurrentPose, setOnTargetPose, resetOnTargetPose,
};
