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
import mediapipe, { TARGET_POSE_SQUAT_0, TARGET_POSE_SQUAT_1 } from '@library/mediapipe';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import {
  setTempSettings, Course, getCourseSettings, saveResults, clearResults,
} from '@library/storage';
import ElemManager from '@src/types/ElemManager';
import ExcerciseManager from '@src/types/ExerciseManager';

const UI = new ElemManager();
const manager = new ExcerciseManager();

let settings: Course[] | null = null;
let currentIdx = -1;

const initContent = () => {
  setTempSettings();
  settings = getCourseSettings();

  if (settings === null) return;

  currentIdx = 0;
  const { exercise, repeat } = settings[currentIdx];

  manager.setGoal(repeat);
  manager.setExerciseName(exercise);
  manager.setMessage('쭈구려');
  manager.setCountToZero();

  UI.updateGoal(manager.getGoal());
  UI.updateCount(manager.getCount());
  UI.updateExerciseName(manager.getExerciseName());
  UI.updateMessage(manager.getMessage());
};

initContent();

let tgtEvent = TARGET_POSE_SQUAT_0;
const listen = () => {
  if (tgtEvent === TARGET_POSE_SQUAT_0) {
    mediapipe.setOnTargetPose(TARGET_POSE_SQUAT_0, (tgt, diff) => {
      tgtEvent = TARGET_POSE_SQUAT_1;
      manager.setMessage('쭈구려');
      UI.updateMessage(manager.getMessage());
      mediapipe.resetOnTargetPose();
      setTimeout(() => {
        listen();
      }, 1000);
    });
  } else if (tgtEvent === TARGET_POSE_SQUAT_1) {
    mediapipe.setOnTargetPose(TARGET_POSE_SQUAT_1, (tgt, diff) => {
      tgtEvent = TARGET_POSE_SQUAT_0;
      manager.incrementCount();
      UI.updateCount(manager.getCount());
      manager.setMessage('일어나');
      UI.updateMessage(manager.getMessage());
      mediapipe.resetOnTargetPose();

      if (manager.isSuccess()) {
        saveResults('squat', Date.now(), true);
        manager.setMessage('잘했어요!');
        UI.updateMessage(manager.getMessage());

        setTimeout(() => {
          window.close();
        }, 4000);
      } else {
        setTimeout(() => {
          listen();
        }, 1000);
      }
    });
  }
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
      console.warn('성능부족, 30FPS 보장못함', time, deltaTime);
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
