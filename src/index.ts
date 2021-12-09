import '@src/style.scss';
import { SceneManager } from '@library/scene';
import mediapipe, { TargetPose, EXERCISE_POSE, EXERCISE_MESSAGE } from '@library/mediapipe';
import {
  setTempSettings, Course, getCourseSettings, saveResults
} from '@library/storage';
import ElemManager from '@src/types/ElemManager';
import ExcerciseManager from '@src/types/ExerciseManager';

const UI = new ElemManager();
const manager = new ExcerciseManager();

const courses: Course[] | null = getCourseSettings();
let curCourseIdx = 0;
let curPoseIdx = 0;
let messages: string[];
let targetEvents: TargetPose[];
let targetEvent: TargetPose;

const initContent = () => {
  if (courses === null) return;

  // 현재 수행해야할 운동 이름과 반복 횟수를 가져온다.
  const { exercise, exerciseName, repeat } = courses[curCourseIdx];
  // 현재 수행해야할 운동을 설명하는 메시지 리스트를 가져온다.
  messages = EXERCISE_MESSAGE[exercise];
  // 현재 수행해야할 운동을 구성하는 동작 리스트를 가져온다.
  targetEvents = EXERCISE_POSE[exercise];
  // 현재 동작을 가리키는 인덱스를 0으로 초기화한다.
  curPoseIdx = 0;
  targetEvent = targetEvents[curPoseIdx];

  // state 초기화
  manager.setExerciseName(exercise);
  manager.setMessage(messages[0]);
  manager.setGoal(repeat);
  manager.setCountToZero();

  // state로 UI 업데이트
  UI.updateExerciseName(exerciseName);
  UI.updateMessage(manager.getMessage());
  UI.updateGoal(manager.getGoal());
  UI.updateCount(manager.getCount());
};

initContent();

const listen = () => {
  mediapipe.setOnTargetPose(targetEvent, (tgt, diff) => {
    // 현재 취하고 있는 동작이 운동의 마지막 동작이라면 카운트를 올린다.
    if (curPoseIdx === targetEvents.length - 1) {
      manager.incrementCount();
      UI.updateCount(manager.getCount());
    }

    // 타겟이벤트를 다음에 수행해야할 동작으로 업데이트하기
    curPoseIdx = (curPoseIdx + 1) % targetEvents.length;
    targetEvent = targetEvents[curPoseIdx];

    // 메시지 UI를 다음에 수행해야할 동작을 설명하는 메시지로 업데이트하기
    manager.setMessage(messages[curPoseIdx]);
    UI.updateMessage(manager.getMessage());

    mediapipe.resetOnTargetPose();

    // 현재 수행 중인 운동의 반복 횟수를 모두 수행했으면
    if (manager.isSuccess()) {
      // 로컬 스토리지에 수행 결과를 저장한다.
      saveResults(manager.getExerciseName(), Date.now(), true);
      // 메시지 UI를 업데이트하다.
      manager.setMessage('잘했어요!');
      UI.updateMessage(manager.getMessage());

      if (curCourseIdx + 1 === courses?.length) {
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        curCourseIdx += 1;
        initContent();
        listen();
      }
    } else {
      // 1초 후 다음 동작으로 넘어간다.
      setTimeout(() => {
        listen();
      }, 1000);
    }
  });
};
listen();

interface XYZ {
  x: number
  y: number
  z: number
}

const Center = (a: XYZ, b: XYZ) => {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2
  }
}

const Transform = (a: XYZ) => {
  return {
    x: a.x * 100,
    y: -a.y * 100 - 40,
    z: - a.z * 100
  }
}
const init = async () => {

  await mediapipe.Load(document.getElementById("debug-panel") as HTMLCanvasElement);

  const canvas = document.createElement("canvas")
  document.body.append(canvas)
  const scene = new SceneManager(canvas, () => {
    const pose = mediapipe.GetCurrentPose()
    if (pose.raw === undefined || !pose.hasPoseData) {
      return null
    }
    const l = pose.raw.poseWorldLandmarks.map(e => Transform(e))

    const tmp = {
      head: {
        position: Center(l[11], l[12]),
        lookAt: Center(l[7], l[8]),
      },
      body: {
        position: Center(l[11], l[12]),
        lookAt: Center(l[23], l[24]),
      },
      right_upper_arm: {
        position: l[11],
        lookAt: l[13]
      },
      right_lower_arm: {
        position: l[13],
        lookAt: l[15]
      },
      left_upper_arm: {
        position: l[12],
        lookAt: l[14]
      },
      left_lower_arm: {
        position: l[14],
        lookAt: l[16]
      },

      right_upper_leg: {
        position: l[23],
        lookAt: l[25]
      },
      right_lower_leg: {
        position: l[25],
        lookAt: l[27]
      },
      left_upper_leg: {
        position: l[24],
        lookAt: l[26]
      },
      left_lower_leg: {
        position: l[26],
        lookAt: l[28]
      }
    }
    return tmp
  })


  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    scene.resizeScreen()
  }
  resize()
  window.addEventListener('resize', resize);

  scene.Start()
};

(async () => await init())();
