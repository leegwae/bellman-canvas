import camera_utils from "@mediapipe/camera_utils";
import Pose from "@mediapipe/pose";

const OnPoseResult = async (result: Pose.Results) => {
  console.log(result);
};

const Load = async () => {
  // init cam element
  const camElem = document.createElement("video");

  // init pose
  const pose = new Pose.Pose({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${Pose.VERSION}/${file}`;
    },
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

  const cam = new camera_utils.Camera(camElem, {
    onFrame: async () => {
      await pose.send({
        image: camElem,
      });
      return;
    },
  });

  await cam.start();
};

export default { Load };
