import { Bone } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM } from '@pixiv/three-vrm';

const LoadGLTF = async (url: string): Promise<GLTF> => new Promise((resolve, reject) => {
  const loader = new GLTFLoader();
  loader.load(url,
    (gltf) => {
      resolve(gltf);
    },
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => {
      console.error(error);
      reject(error);
    });
});

const LoadBones = (model: GLTF): { [name: string]: Bone } => {
  const tmp: { [name: string]: Bone } = {};
  model.scene.traverse((e) => {
    if (e.type === 'Bone') {
      tmp[e.name] = e as Bone;
    }
  });
  return tmp;
};

const LoadVRM = (model: GLTF): Promise<VRM> => new Promise((resolve, reject) => {
  VRM.from(model).then(resolve)
    .catch((error) => {
      console.error(error);
      reject(error);
    });
});

export default { LoadGLTF, LoadBones, LoadVRM };
