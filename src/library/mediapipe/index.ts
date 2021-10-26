import cameraUtils from '@mediapipe/camera_utils';
import Pose from '@mediapipe/pose';

type CurrentPose = {
  raw: Pose.Results;
  image: Pose.GpuBuffer;
  hasPoseData: boolean;
  debug: {
    points: { x: number; y: number }[];
  };
};

let CP: CurrentPose;

const OnPoseResult = async (result: Pose.Results) => {
  const points = result.poseLandmarks?.map((p) => ({
    x: p.x * 320,
    y: p.y * 240,
  }));
  CP = {
    raw: result,
    image: result.image,
    hasPoseData: result.poseWorldLandmarks !== undefined,
    debug: {
      points: points || [],
    },
  };
};

const GetCurrentPose = () => {
  if (CP === undefined) {
    return undefined;
  }
  return CP;
};

const Load = async () => {
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

  pose.onResults(OnPoseResult);

  const cam = new cameraUtils.Camera(camElem, {
    onFrame: async () => {
      await pose.send({
        image: camElem,
      });
    },
  });

  await cam.start();
};

export default { Load, GetCurrentPose };
