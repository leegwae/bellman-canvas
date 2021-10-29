import Pose from '@mediapipe/pose';
import {
  PoseDifference, PoseSignature, TargetPose, POSE_SIGNITURE_POINTS,
} from './consts';

const getPoseSignature = (landmarks: Pose.LandmarkList): PoseSignature[] => {
  if (landmarks === undefined) {
    return POSE_SIGNITURE_POINTS.map((_, i) => ({ id: i, value: 0 }));
  }
  const result = POSE_SIGNITURE_POINTS.map((val) => {
    const a = landmarks[val.a];
    const b = landmarks[val.b];
    return {
      id: val.id,
      value: Math.sqrt(
        (a.x - b.x) ** 2
        + (a.y - b.y) ** 2
        + (a.z - b.z) ** 2,
      ),
    };
  });
  return result;
};

const calcuratePoseDiff = (p : PoseSignature[], target: TargetPose) : PoseDifference[] => {
  const poseMap: {[id: number]: number} = {};
  p.forEach((v) => {
    poseMap[v.id] = v.value;
  });
  const diff = target.signature.map((sig) => ({
    id: sig.id,
    value: (poseMap[sig.id] - sig.value) ** 2,
  }));
  return diff;
};

const drawDebugCanvas = (canvas: HTMLCanvasElement, p: Pose.Results, targetPose?: TargetPose) => {
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return;
  }
  ctx.font = '18px Arial';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.drawImage(p.image, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  if (p.poseWorldLandmarks) {
    p.poseLandmarks.forEach((point, i) => {
      ctx.fillText(`${i}`, point.x * canvas.width, point.y * canvas.height);
    });
  } else {
    ctx.drawImage(p.image, 0, 0, canvas.width, canvas.height);
  }

  const barHeight = 30;
  const signature = getPoseSignature(p.poseLandmarks);
  signature.forEach((sig, i) => {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, i * barHeight, sig.value * 100, barHeight);
    ctx.fillStyle = 'white';
    ctx.fillText(`${i}: ${sig.value.toFixed(3)}`, barHeight, (i + 1) * barHeight);
  });

  if (targetPose !== undefined) {
    const diff = calcuratePoseDiff(signature, targetPose);
    const similarity = diff.map((v) => v.value).reduce((prev, cur) => prev + cur);

    // Pose Difference 그리기
    ctx.font = '30px Arial';
    if (targetPose.similarityGoal > similarity) {
      ctx.fillStyle = 'green';
    } else {
      ctx.fillStyle = 'red';
    }
    ctx.fillText(`${similarity.toFixed(3)}`, barHeight * 10, 100);
    ctx.font = '18px Arial';

    // 초록색 막대
    targetPose.signature.forEach((v) => {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(0, v.id * barHeight, v.value * 100, barHeight);
    });
    // 노란색 막대
    diff.forEach((v) => {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
      ctx.fillRect(0, v.id * barHeight, v.value * 100, barHeight);
      ctx.fillStyle = 'rgba(255, 255, 0, 1)';
      ctx.fillText(`${v.id}: ${v.value.toFixed(3)}`, barHeight * 5, (v.id + 1) * barHeight);
    });
  }
};

export default { drawDebugCanvas, getPoseSignature, calcuratePoseDiff };
