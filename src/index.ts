import '@src/style.scss';
import {
  Clock,
  Mesh,
  DirectionalLight,
  Line,
  IcosahedronGeometry,
  MeshPhongMaterial,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
} from 'three';
import camera from '@library/camera';
import scene from '@library/scene';
import plane from '@library/plane';
import renderer from '@library/renderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import mediapipe, { TargetPose, EXERCISE_POSE, EXERCISE_MESSAGE } from '@library/mediapipe';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import {
  setTempSettings, Course, getCourseSettings, saveResults, clearResults,
} from '@library/storage';
import ElemManager from '@src/types/ElemManager';
import ExcerciseManager from '@src/types/ExerciseManager';

const UI = new ElemManager();
const manager = new ExcerciseManager();

setTempSettings();

const courses: Course[] | null = getCourseSettings();
const curCourseIdx = 0;
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
    if (curPoseIdx + 1 === targetEvents.length) {
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

      setTimeout(() => {
        window.close();
      }, 3000);
    } else {
      // 1초 후 다음 동작으로 넘어간다.
      setTimeout(() => {
        listen();
      }, 1000);
    }
  });
};
listen();

const clock = new Clock();

const animate = (cameraControl: OrbitControls, spheres: Mesh[], lines: Line[]) => {
  const render = (time = 0) => {
    const CurrentPose = mediapipe.GetCurrentPose();

    // model animation
    if (CurrentPose.raw !== undefined) {
      CurrentPose.raw.poseLandmarks?.forEach((ptr: any, i: any) => {
        if (spheres[i]) {
          const x = ptr.x * 1.5;
          const y = (1 - ptr.y) * 1.5;
          const z = -ptr.z * 1.5;
          spheres[i].position.set(x, y, z);
        }
      });
      POSE_CONNECTIONS.forEach((val, i) => {
        const [a, b] = val;
        if (lines[i] && spheres[a] && spheres[b]) {
          lines[i].geometry.attributes.position.setXYZ(
            0,
            spheres[a].position.x,
            spheres[a].position.y,
            spheres[a].position.z,
          );
          lines[i].geometry.attributes.position.setXYZ(
            1,
            spheres[b].position.x,
            spheres[b].position.y,
            spheres[b].position.z,
          );
          // eslint-disable-next-line no-param-reassign
          lines[i].geometry.attributes.position.needsUpdate = true;
        }
      });
    }
    // camera
    // TODO (@이완해): 이게 정식방법은 아닌거 같은데, 일단 작동은 하니깐 좀 방치해두고 나중에 (중간발표 이후에) 개선해두겠습니다.
    cameraControl.target = spheres[0].position;
    cameraControl.update();

    const deltaTime = clock.getDelta();
    // render time
    if (deltaTime >= 0.033) {
      // console.warn('성능부족, 30FPS 보장못함', time, deltaTime);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const initCanvas = async () => {
  await mediapipe.Load(UI.getDebugPanel());
  // light
  const dirLight = new DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;

  scene.add(dirLight);

  // ground
  scene.add(plane);

  // model
  const geometry = new IcosahedronGeometry(0.05);
  const material = new MeshPhongMaterial({
    color: '#38d9a9',
  });
  const spheres = [...Array(31)].map(() => {
    const s = new Mesh(geometry, material);
    scene.add(s);
    return s;
  });

  const lineMaterial = new LineBasicMaterial({ color: 0x0000ff });
  const lines = POSE_CONNECTIONS.map(() => {
    const lineGeometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 0),
    ]);
    const line = new Line(lineGeometry, lineMaterial);
    scene.add(line);
    return line;
  });

  // camera
  camera.position.set(0, 2, 5);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(0, 1.8, 0);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
  animate(controls, spheres, lines);
};

(async () => await initCanvas())();
