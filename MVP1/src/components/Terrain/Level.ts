
import {Terrain} from "./TerrainMatthias";
import * as THREE from "three";
import {
    AmbientLight,
    AxesHelper,
    BoxGeometry,
    Camera,
    Color,
    DirectionalLight,
    Light,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import TerrainRenderer from "./TerrainRenderer";
import {Vnode} from "mithril";
import {RandomTerrainBuilderGenerator} from "./Generators/RandomTerrainBuilderGenerator";


export default class Level {

    get terrain(): Terrain {
        return this._terrain;
    }

    get camera(): PerspectiveCamera {
        return this._camera;
    }

    get scene(): Scene {
        return this._scene;
    }

    private _terrain: Terrain;
    private _camera: PerspectiveCamera;
    private _scene: Scene;
    private ligths: Light[];
    private renderer: TerrainRenderer;
    private canvasWidth: number;
    private canvasHeight: number;

    constructor(vnode: Vnode<any>)
    {
        console.log("Starting level");
        console.log(vnode);
        this._terrain = (vnode.attrs.terrain) ? new RandomTerrainBuilderGenerator().generate() : new RandomTerrainBuilderGenerator().generate();

        this._camera = new PerspectiveCamera();
        this._scene = new Scene();
        this.ligths = [];
        this.renderer = new TerrainRenderer(this);
        this.canvasWidth = 100;
        this.canvasHeight = 100;

        this.setup();
    }

    view(vnode: Vnode)
    {
        console.log("Getting into level view");

    }

    setTerrain(terrain : Terrain)
    {
        this._terrain = terrain;
        this.setup();
    }

    testIfResized() {
        
        console.log("Testing if the frame needs to be resized");
        const canvas = this.renderer.canvas;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = this.canvasWidth !== width || this.canvasHeight !== height;
        if (needResize) {
            this.renderer.resize(width, height);
            this.getCanvasDimensions();
            this.resetCameraProperties();

            console.log("Canvas set to: width: {0}, height: {1}", width, height);
        }
        return needResize;
    }

    private setup() : void
    {
        this.setupCanvas();
        this.setupScene();

        this.renderer.animate();
    }

    private setupCanvas() {
        console.log("Setting up the canvas");

        this.getCanvasDimensions();
        this.setupCamera();


        /**
         * Set up the scene & all standard objects in it
         * @type {Scene}
         */
        this._scene = new Scene();
        let axesHelper = new AxesHelper(3);
        //let controls = new THREE.OrbitControls(this._camera, this.renderer.canvas);

        let ambientLight = new AmbientLight(new Color(1, 1, 0.7), 0.2);
        let directionalLight = new DirectionalLight(new Color(1, 1, 0.3), 1);
        directionalLight.position.set(1, 1, 10);

        this.ligths.push(ambientLight, directionalLight);


        //this.scene.add(axesHelper);
        //this.scene.add(controls);
        this._scene.add(ambientLight);
        this._scene.add(directionalLight);
    }

    private setupScene() {
        console.log("Setting up the scene");
        /**
         * Create a cube and add it to the scene
         * @type {BoxGeometry|BoxGeometry}
         */
        let cubeGeometry = new BoxGeometry(1, 1, 1);
        let material = new MeshPhongMaterial({color: new Color(1, 0.8, 0.5)});

        this._terrain.generateMesh();
        this._terrain.mesh.material = material;

        this._scene.add(this._terrain.mesh);

        /** Test cube
        const cube = new Mesh(cubeGeometry, material);
        cube.castShadow = true;
        //cube.position.z = 6;
        this.scene.add(cube); */
    }

    private getCanvasDimensions() {
        this.canvasWidth = this.renderer.canvas.width;
        this.canvasHeight = this.renderer.canvas.height;
    }

    private setupCamera() {
        this._camera = new THREE.PerspectiveCamera(75, 1, 0.1, 5000);
        this.resetCameraProperties();
    }

    private resetCameraProperties() {
        this._camera.up.set(0, 0, 1);
        // this.camera.position.z = 3;
        this._camera.position.set(700, -700, 400);
        // this._camera.position.set(1, 1.5, 1);
        this._camera.lookAt(new Vector3(0, 0, 0));
        this._camera.aspect = this.canvasWidth / this.canvasHeight;
        this._camera.updateProjectionMatrix();
    }

    rotateCameraAroundCenter(degreesToRotate: number)
    {

    }
}
