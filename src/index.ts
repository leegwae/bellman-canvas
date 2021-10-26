import '@src/style.scss';

import * as THREE from 'three';
import camera from '@library/camera';
import scene from '@library/scene';
import plane from '@library/plane';
import renderer from '@library/renderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import mediapipe from '@library/mediapipe';

// ============ [ 임시 상수 ] =======================
const Panel = {
  course: {
    elem: document.getElementById('course'),
    content: '스쿼트',
  },
  message: {
    elem: document.getElementById('message'),
    content: '손을 펴고 다리를 굽히고',
  },
  goal: {
    elem: document.getElementById('count'),
    content: 3,
  },
  debug: {
    elem: document.getElementById('debugging') as HTMLCanvasElement,
  },
};

const clock = new THREE.Clock();

const lineList = [
  { a: 0, b: 1 },
  { a: 0, b: 4 },
  { a: 1, b: 2 },
  { a: 2, b: 3 },
  { a: 3, b: 7 },
  { a: 4, b: 5 },
  { a: 5, b: 6 },
  { a: 6, b: 8 },
  { a: 9, b: 10 },
  { a: 11, b: 12 },
  { a: 11, b: 13 },
  { a: 11, b: 23 },
  { a: 12, b: 14 },
  { a: 12, b: 24 },
  { a: 13, b: 15 },
  { a: 14, b: 16 },
  { a: 15, b: 17 },
  { a: 15, b: 19 },
  { a: 15, b: 21 },
  { a: 16, b: 18 },
  { a: 16, b: 20 },
  { a: 16, b: 22 },
  { a: 23, b: 24 },
  { a: 23, b: 25 },
  { a: 24, b: 26 },
  { a: 25, b: 27 },
  { a: 26, b: 28 },
  { a: 27, b: 29 },
  { a: 27, b: 31 },
  { a: 28, b: 30 },
  { a: 28, b: 32 },
  { a: 29, b: 31 },
  { a: 30, b: 32 },
];

const animate = (spheres: THREE.Mesh[], lines: THREE.Line[]) => {
  const render = (time = 0) => {
    const CurrentPose = mediapipe.GetCurrentPose();

    // Drawing Pannels
    if (Panel.course.elem) Panel.course.elem.innerText = Panel.course.content;
    // if (Panel.goal.elem) [...Array(3)].map(() => createCircle(Panel.goal.elem));
    if (Panel.message.elem) { Panel.message.elem.innerText = Panel.message.content; }

    // drawing debugging info
    if (Panel.debug.elem) {
      if (CurrentPose) {
        const canvas = Panel.debug.elem;
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, 320, 240);
        if (CurrentPose.hasPoseData) {
          CurrentPose.debug.points.forEach((p, i) => {
            ctx?.fillText(`${i}`, p.x, p.y);
          });
        } else {
          ctx?.drawImage(CurrentPose.raw.image, 0, 0, 320, 240);
        }
      }
    }

    // model animation
    if (CurrentPose) {
      CurrentPose.raw.poseWorldLandmarks?.forEach((ptr, i) => {
        if (spheres[i]) {
          const x = ptr.x * 1.5;
          const y = (1 - ptr.y) * 1.5;
          const z = -ptr.z * 1.5;
          spheres[i].position.set(x, y, z);
        }
      });
      lineList.forEach((val, i) => {
        const { a, b } = val;
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
  await mediapipe.Load();
  // light
  const dirLight = new THREE.DirectionalLight(0xffffff);
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
  // samples are from here https://hub.vroid.com/en/characters/1248981995540129234/models/8640547963669442173
  // const gltf = await model.LoadGLTF("/sample-1.vrm");
  // const vrmModel = await model.LoadVRM(gltf);
  // scene.add(vrmModel.scene);

  const geometry = new THREE.IcosahedronGeometry(0.05);
  const material = new THREE.MeshPhongMaterial({
    color: '#38d9a9',
  });
  const spheres = [...Array(31)].map(() => {
    const s = new THREE.Mesh(geometry, material);
    scene.add(s);
    return s;
  });

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const lines = lineList.map(() => {
    const linegeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    const line = new THREE.Line(linegeometry, lineMaterial);
    scene.add(line);
    return line;
  });

  // camera
  camera.position.set(0, 2, 5);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(0, 1.8, 0);
  controls.update();

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
  animate(spheres, lines);
};

initCanvas();
