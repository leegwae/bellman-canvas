import { Scene, Color, Fog } from "three";

const scene = new Scene();
scene.background = new Color(0xa0a0a0);
scene.fog = new Fog(0xa0a0a0, 10, 50);


export default scene;