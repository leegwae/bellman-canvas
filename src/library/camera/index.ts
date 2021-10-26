import { PerspectiveCamera } from 'three';

const SCREEN_WIDTH: number = window.innerWidth;
const SCREEN_HEIGHT: number = window.innerHeight;
const VIEW_ANGLE = 45;
const ASPECT: number = SCREEN_WIDTH / SCREEN_HEIGHT;
const NEAR = 1;
const FAR = 10000;

const camera: PerspectiveCamera = new PerspectiveCamera(
  VIEW_ANGLE,
  ASPECT,
  NEAR,
  FAR,
);

export default camera;
