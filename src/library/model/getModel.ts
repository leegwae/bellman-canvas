import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const getModel = (modelFileUrl: string) => {
	const loader = new GLTFLoader();
	let model: Group = new Group();
	loader.load(modelFileUrl, function (gltf) {
		model = gltf.scene;
		model.traverse(function (object) {
		  object.castShadow = true;
      object.visible = true;
		});
	});

	return model;
};

export default getModel;