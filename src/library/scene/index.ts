import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const NewDummyMesh = () => {
    const geo = new THREE.SphereGeometry(0.5)
    const mat = new THREE.MeshBasicMaterial({ color: "red" })
    return new THREE.Mesh(geo, mat)
}

interface XYZ {
    x: number
    y: number
    z: number
}

type PoseInfo = {
    position: XYZ
    lookAt: XYZ
}

type AvatarPoseInfo = {
    head: PoseInfo
    body: PoseInfo
    right_upper_arm: PoseInfo
    right_lower_arm: PoseInfo
    right_upper_leg: PoseInfo
    right_lower_leg: PoseInfo

    left_upper_arm: PoseInfo
    left_lower_arm: PoseInfo
    left_upper_leg: PoseInfo
    left_lower_leg: PoseInfo
}

export class SceneManager {
    canvasElem: HTMLCanvasElement
    renderer: THREE.WebGLRenderer
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    clock: THREE.Clock
    control: OrbitControls

    updatePoseFunc: () => AvatarPoseInfo | null

    debug: THREE.Mesh
    debug2: THREE.Mesh

    head: THREE.Mesh
    body: THREE.Mesh
    ruarm: THREE.Mesh
    rlarm: THREE.Mesh
    luarm: THREE.Mesh
    llarm: THREE.Mesh
    ruleg: THREE.Mesh
    rlleg: THREE.Mesh
    luleg: THREE.Mesh
    llleg: THREE.Mesh


    constructor(cavasElem: HTMLCanvasElement, updatePoseFunc: () => AvatarPoseInfo | null) {
        this.canvasElem = cavasElem
        this.clock = new THREE.Clock()
        this.updatePoseFunc = updatePoseFunc

        // renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasElem })
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // camera
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 5, 100);

        // camera orbit
        this.control = new OrbitControls(this.camera, this.canvasElem);
        this.control.target.set(0, -10, 0);
        this.control.update();

        // scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('black')
        {
            // debug
            this.debug = NewDummyMesh()
            scene.add(this.debug)
            this.debug2 = NewDummyMesh()
            scene.add(this.debug2)

            // light
            const color = 'white';
            const intensity = 1;
            const light = new THREE.AmbientLight(color, intensity);
            scene.add(light);

            // Material
            const material = new THREE.MeshPhongMaterial({
                color: '#8AC',
                shininess: 150,
            });

            // head
            {
                const base = NewDummyMesh()
                const radius = 6;  // ui: radius
                const widthSegments = 32;  // ui: widthSegments
                const heightSegments = 32;  // ui: heightSegments
                const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
                const mesh = new THREE.Mesh(geometry, material)
                mesh.position.set(0, 0, radius)

                base.add(mesh)
                base.position.set(0, 5, 0)
                base.lookAt(0, 100, 0)
                this.head = base

                scene.add(base);
            }

            // body
            {
                const base = NewDummyMesh()
                const width = 14;  // ui: width
                const height = 25;  // ui: height
                const depth = 8;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)
                mesh.rotateX(-Math.PI / 2)
                mesh.position.set(0, 0, height / 2)


                base.add(mesh)
                base.position.set(0, 3, 0)

                base.lookAt(0, 1, 0)
                this.body = base

                scene.add(base);
            }

            // right upper arm
            {
                const base = NewDummyMesh()
                const width = 5;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)
                mesh.rotateX(Math.PI / 2)
                mesh.position.set(0, 0, height / 2)
                base.add(mesh)
                base.position.set(12, -0, 0)
                base.lookAt(12, -100, 0)
                this.ruarm = base

                scene.add(base);
            }

            // right lower arm
            {
                const base = NewDummyMesh()
                const width = 5;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)

                mesh.rotateX(Math.PI / 2)
                mesh.position.set(0, 0, height / 2)
                base.add(mesh)
                base.position.set(12, -17, 0)
                base.lookAt(12, -100, 0)
                this.rlarm = base


                scene.add(base);
            }


            // right upper leg
            {
                const base = NewDummyMesh()
                const width = 7;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)

                mesh.rotateX(Math.PI / 2)
                base.add(mesh)
                mesh.position.set(0, 0, height / 2)
                base.position.set(4, -24, 0)
                base.lookAt(4, -1000, 0)

                this.ruleg = base

                scene.add(base);
            }

            // right lower leg
            {
                const base = NewDummyMesh()
                const width = 7;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)

                mesh.rotateX(Math.PI / 2)
                base.add(mesh)
                mesh.position.set(0, 0, height / 2)
                base.position.set(4, -43, 0)
                base.lookAt(4, -1000, 0)

                this.rlleg = base

                scene.add(base);
            }


            // left upper arm
            {
                const base = NewDummyMesh()
                const width = 5;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)
                mesh.rotateX(Math.PI / 2)
                mesh.position.set(0, 0, height / 2)
                base.add(mesh)
                base.position.set(-12, -0, 0)
                base.lookAt(-12, -100, 0)
                this.luarm = base

                scene.add(base);
            }


            // left lower arm
            {
                const base = NewDummyMesh()
                const width = 5;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)

                mesh.rotateX(Math.PI / 2)
                mesh.position.set(0, 0, height / 2)
                base.add(mesh)
                base.position.set(-12, -17, 0)
                base.lookAt(-12, -100, 0)
                this.llarm = base


                scene.add(base);
            }


            // right upper leg
            {
                const base = NewDummyMesh()
                const width = 7;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)

                mesh.rotateX(Math.PI / 2)
                base.add(mesh)
                mesh.position.set(0, 0, height / 2)
                base.position.set(-4, -24, 0)
                base.lookAt(-4, -1000, 0)

                this.luleg = base

                scene.add(base);
            }

            // right lower leg
            {
                const base = NewDummyMesh()
                const width = 7;  // ui: width
                const height = 15;  // ui: height
                const depth = 5;  // ui: depth
                const geometry = new THREE.BoxGeometry(width, height, depth);
                const mesh = new THREE.Mesh(geometry, material)

                mesh.rotateX(Math.PI / 2)
                base.add(mesh)
                mesh.position.set(0, 0, height / 2)
                base.position.set(-4, -43, 0)
                base.lookAt(-4, -1000, 0)

                this.llleg = base

                scene.add(base);
            }


        }
        this.scene = scene

        this.renderer.render(this.scene, this.camera)
    }

    Start() {
        requestAnimationFrame(this.Animate.bind(this))
    }

    Animate() {
        // this.resizeScreen()
        const delta = this.clock.getDelta()

        {
            const pose = this.updatePoseFunc()

            if (pose !== null) {
                {
                    const p = pose.head
                    const t = this.head
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.body
                    const t = this.body
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.right_upper_arm
                    const t = this.ruarm
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.right_lower_arm
                    const t = this.rlarm
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.right_upper_leg
                    const t = this.ruleg
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.right_lower_leg
                    const t = this.rlleg
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.left_upper_arm
                    const t = this.luarm
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.left_lower_arm
                    const t = this.llarm
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.left_upper_leg
                    const t = this.luleg
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
                {
                    const p = pose.left_lower_leg
                    const t = this.llleg
                    let { x, y, z } = p.position
                    t.position.set(x, y, z)
                    const l = p.lookAt
                    t.lookAt(l.x, l.y, l.z)
                }
            }

        }

        this.control.update()
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.Animate.bind(this))
    }

    resizeScreen() {
        const width = this.canvasElem.width
        const height = this.canvasElem.height
        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
    }
}