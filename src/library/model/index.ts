import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const LoadGLTF = async (url: string): Promise<GLTF> => {
	return await new Promise((resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(url,
			(gltf) => {
				resolve(gltf)
			},
			(progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
			(error) => {
				console.error(error)
				reject(error)
			}
		)
	})
};

export default { LoadGLTF };