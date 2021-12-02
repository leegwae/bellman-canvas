import { Mesh, PlaneGeometry, MeshPhongMaterial } from 'three';

const plane = new Mesh(
  new PlaneGeometry(100, 100),
  new MeshPhongMaterial({ color: 'black', depthWrite: false }),
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;

export default plane;
