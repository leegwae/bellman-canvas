import "@src/style.scss";

import * as THREE from "three";
import camera from "@library/camera";
import scene from "@library/scene";
import plane from "@library/plane";
import renderer from "@library/renderer";
import model from "@library/model";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRM, VRMSchema } from "@pixiv/three-vrm";
import MediaPipe from "@library/mediapipe";
import mediapipe from "@library/mediapipe";

// ============ [ 임시 상수 ] =======================
const Panel = {
  course: {
    elem: document.getElementById("course"),
    content: "스쿼트",
  },
  message: {
    elem: document.getElementById("message"),
    content: "손을 펴고 다리를 굽히고",
  },
  goal: {
    elem: document.getElementById("count"),
    content: 3,
  },
  debug: {
    elem: document.getElementById("debugging") as HTMLCanvasElement,
  },
};

const createCircle = (parent: HTMLElement) => {
  const circle = document.createElement("div");
  circle.className = "circle";
  parent.appendChild(circle);
};

const initCanvas = async () => {
  await MediaPipe.Load();
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
  const gltf = await model.LoadGLTF("/sample-1.vrm");
  const vrmModel = await model.LoadVRM(gltf);
  scene.add(vrmModel.scene);

  // camera
  camera.position.set(0, 2, 5);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(0, 1.8, 0);
  controls.update();

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  animate(vrmModel);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const clock = new THREE.Clock();

const animate = (vrm: VRM) => {
  const render = (time: DOMHighResTimeStamp = 0) => {
    const CurrentPose = mediapipe.GetCurrentPose();

    // Drawing Pannels
    if (Panel.course.elem) Panel.course.elem.innerText = Panel.course.content;
    // if (Panel.goal.elem) [...Array(3)].map(() => createCircle(Panel.goal.elem));
    if (Panel.message.elem)
      Panel.message.elem.innerText = Panel.message.content;

    // drawing debugging info
    if (Panel.debug.elem) {
      if (CurrentPose) {
        const canvas = Panel.debug.elem;
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, 320, 240);
        if (CurrentPose.hasPoseData) {
          CurrentPose.debug.points.map((p, i) => {
            ctx?.fillText(`${i}`, p.x, p.y);
          });
        } else {
          ctx?.drawImage(CurrentPose.raw.image, 0, 0, 320, 240);
        }
      }
    }

    // model animation
    const s = 0.25 * Math.PI * Math.sin(Math.PI * clock.elapsedTime);
    const deltaTime = clock.getDelta();
    if (vrm.humanoid == undefined) {
      return;
    }
    const humanoid = vrm.humanoid;
    humanoid
      .getBone(VRMSchema.HumanoidBoneName.Neck)
      ?.node.rotation.set(0, s, 0);
    humanoid
      .getBone(VRMSchema.HumanoidBoneName.RightUpperArm)
      ?.node.rotation.set(0, 0, s);
    humanoid
      .getBone(VRMSchema.HumanoidBoneName.RightUpperLeg)
      ?.node.rotation.set(s, 0, 0);

    // draw on raw canvas

    // render time
    if (deltaTime >= 0.033) {
      console.warn("성능부족, 30FPS 보장못함", time, deltaTime);
    }
    renderer.render(scene, camera);
    vrm.update(deltaTime);
    requestAnimationFrame(render);
  };
  render();
};

initCanvas();
