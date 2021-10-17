import { HemisphereLight, DirectionalLight } from 'three';
import camera from '@library/camera';
import scene from '@library/scene';
import plane from '@library/plane'
import renderer from '@library/renderer'
import model from '@library/model';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const init = async () => {
  // ================= [ light ] ====================================
  const hemiLight = new HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);

  const dirLight = new DirectionalLight(0xffffff);
  dirLight.position.set(3, 10, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;

  scene.add(hemiLight);
  scene.add(dirLight);

  // ground
  scene.add(plane);

  // model
  const gltf = await model.LoadGLTF("/Xbot.glb")
  scene.add(gltf.scene);

  // camera
  camera.position.set(0, 2, 5);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.set(0, 1.8, 0);
  controls.update();

  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  animate();
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

const animate = () => {
  // Render loop
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

init();