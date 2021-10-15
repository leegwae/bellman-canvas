import { WebGLRenderer, sRGBEncoding } from "three";

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = sRGBEncoding;
renderer.shadowMap.enabled = true;

export default renderer;
