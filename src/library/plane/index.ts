import { Mesh, PlaneGeometry, MeshPhongMaterial } from "three";
const mesh = new Mesh(
  new PlaneGeometry(100, 100),
  new MeshPhongMaterial({ color: 0x999999, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;

export default mesh;
