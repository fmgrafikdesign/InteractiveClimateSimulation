import m from 'mithril';
import {
    AmbientLight,
    AxesHelper,
    Color,
    DirectionalLight,
    Light,
    Material,
    Object3D,
    PerspectiveCamera,
    Scene,
    default as THREE,
    WebGLRenderer,
    MeshBasicMaterial,
    MeshLambertMaterial,
    VertexColors,
    BoxGeometry,
    Mesh,
    Camera,
    Vector3,
    Geometry,
    PlaneGeometry, OrthographicCamera
} from "three";
import {debounce} from "ts-debounce";
import {OrbitControls} from "three-orbitcontrols-ts";
import {ITerrainGenerator} from "./Generators/ITerrainGenerator";
// import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";
import {Terrain} from "./TerrainFabian";
import {RandomTerrainGenerator} from "./Generators/RandomTerrainGenerator";
import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";
import LngLatTerrainGenerator from "./Generators/LngLatTerrainGenerator";
import ITerrain from "./ITerrain";
import Simulation from "../Simulation/Simulation";

export default class StaticTerrainRenderer {
    static generator: ITerrainGenerator = new LngLatTerrainGenerator();
    static renderer: WebGLRenderer;
    static canvas: HTMLCanvasElement;
    static scene: Scene;
    static camera: OrthographicCamera;
    static frameCounter: number;
    static material: Material;
    static terrain: Terrain = StaticTerrainRenderer.generator.generate();

    static updateTerrainGeometry(geometry: PlaneGeometry) {
        if (!this.terrain) {
            console.warn("Tried to updateTerrainMesh, but there is no terrain in the renderer.");
            return;
        }
        this.scene.remove(this.terrain.mesh);
        this.terrain.updateMesh(geometry);
        this.scene.add(this.terrain.mesh);
    }

    static generateTerrainWithLatLng(lat: number, lng: number, zoom: number = 13) {
        const gen = new LngLatTerrainGenerator();
        this.scene.remove(this.terrain.mesh);
        this.terrain = gen.generate(lat, lng);
        this.scene.add(this.terrain.mesh);
    }

    static init(canvas: HTMLCanvasElement, cameraDistance: number = 400) {
        this.canvas = canvas;
        this.frameCounter = 0;

        const rectangle = canvas.getBoundingClientRect();

        this.setupRenderer();
        this.setupScene();
        this.setupSceneCamera(cameraDistance);
        this.addSceneLights();
        this.scene.add(this.terrain.mesh);

        // this.addOrbitControls();
        // this.addAxisHelper();
        // this.initializeTerrainAdjustingControls();
        // this.addCubeToTestRendering();

        this.render();
        this.watchForResize(cameraDistance);
    }

    private static setupScene() {
        this.scene = new Scene();
    }

    private static setupRenderer() {
        const parameters = {canvas: this.canvas, antialias: true, castShadows: true, alpha: true};
        this.renderer = new WebGLRenderer(parameters);
        if (!this.renderer) {
            throw new Error("Failed to create THREE.WebGLRenderer")
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //this.renderer.setClearColor(0xffffff, 0);
        // this.renderer.setClearAlpha(1.0);
    }

    private static setupSceneCamera(distance: number) {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new OrthographicCamera(-distance * aspect, distance * aspect, distance, -distance, 1, 2000);
        this.camera.position.set(distance, distance, distance);
        this.camera.lookAt(this.scene.position);
        this.camera.up.set(1, 0, 1);
        this.camera.updateProjectionMatrix();
    }

    private static addSceneLights() {
        const ambientLight = new AmbientLight(new Color(1, 1, 0.7), 0.15);
        const directionalLight = new DirectionalLight(new Color(1, 1, 0.9), 1);
        directionalLight.position.set(-10, 100, 10);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    private static addOrbitControls() {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.update();
    }

    private static addAxisHelper() {
        const axesHelper = new AxesHelper(1700);
        this.scene.add(axesHelper);
    }

    static render() {

        this.updateTerrain();
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        // console.log(this.frameCounter);
        this.frameCounter++;
        m.redraw();
    }

    static watchForResize(distance: number) {
        // Refactored resize check into a debounced event listener.
        const debouncedResize = debounce(() => {
            const aspect = window.innerWidth / window.innerHeight;
            this.camera.left = -distance * aspect;
            this.camera.right = distance * aspect;
            this.camera.top = distance;
            this.camera.bottom = -distance;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log("resized renderer.");
        }, 50);
        window.addEventListener("resize", (e) => {
            debouncedResize();
        });

    }

    static resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private static addCubeToTestRendering() {
        const geometry = new BoxGeometry(10, 10, 10);
        const material = new MeshBasicMaterial({color: 0x00ff00});
        const cube = new Mesh(geometry, material);
        this.scene.add(cube);
    }

    private static initializeTerrainAdjustingControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code == "ArrowUp") {
                this.camera.position.set(this.camera.position.x, this.camera.position.y + 5, this.camera.position.z);
            } else if (e.code == "ArrowDown") {
                this.camera.position.set(this.camera.position.x, this.camera.position.y - 5, this.camera.position.z);
            } else if (e.code == "ArrowLeft") {
                this.camera.position.set(this.camera.position.x + 5, this.camera.position.y, this.camera.position.z);
            } else if (e.code == "ArrowRight") {
                this.camera.position.set(this.camera.position.x - 5, this.camera.position.y, this.camera.position.z);
            } else if (e.code == "KeyW") {
                this.terrain.geometry.rotateX(Math.PI / 8);
            } else if (e.code == "KeyS") {
                this.terrain.geometry.rotateX(-Math.PI / 2);
            } else if (e.code == "KeyA") {
                this.terrain.geometry.rotateY(Math.PI / 8);
            } else if (e.code == "KeyD") {
                this.terrain.geometry.rotateY(-Math.PI / 8);
            } else if (e.code == "KeyQ") {
                this.terrain.geometry.rotateZ(Math.PI / 8);
            } else if (e.code == "KeyE") {
                this.terrain.geometry.rotateZ(-Math.PI / 8);
            } else if (e.code == "KeyP") {
                Simulation.pause();
            }

            console.log(this.terrain.geometry);

            this.camera.updateProjectionMatrix();
        });

        function adjustCamera() {

        }
    }

    private static updateTerrain()
    {
        // TODO: update terrain colors
    }
}