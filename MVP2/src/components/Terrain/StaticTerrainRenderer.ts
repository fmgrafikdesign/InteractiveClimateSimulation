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
    PlaneGeometry
} from "three";
import {debounce} from "ts-debounce";
import {OrbitControls} from "three-orbitcontrols-ts";
import {ITerrainGenerator} from "./Generators/ITerrainGenerator";
// import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";
import {Terrain} from "./TerrainFabian";
import {RandomTerrainGenerator} from "./Generators/RandomTerrainGenerator";
import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";
import LngLatTerrainGenerator from "./Generators/LngLatTerrainGenerator";

export default abstract class StaticTerrainRenderer {
    static generator: ITerrainGenerator = new LngLatTerrainGenerator();
    static renderer: WebGLRenderer;
    static canvas: HTMLCanvasElement;
    static scene: Scene;
    static camera: Camera;
    static frameCounter: number;
    static material: Material;
    static displayWidth: number;
    static displayHeight: number;
    static terrain: Terrain = StaticTerrainRenderer.generator.generate();

    static updateTerrainGeometry(geometry: PlaneGeometry) {
        if(!this.terrain) {
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

    static init(canvas: HTMLCanvasElement, terrain?: Terrain) {
        this.canvas = canvas;

        const parameters = {canvas: this.canvas, antialias: true, castShadows: true};
        this.renderer = new WebGLRenderer(parameters);
        if (!this.renderer) {
            throw new Error("Failed to create THREE.WebGLRenderer")
        }

        const rectangle = canvas.getBoundingClientRect();
        this.displayWidth = rectangle.width;
        this.displayHeight = rectangle.height;

        this.renderer.setSize(this.displayWidth, this.displayHeight);

        this.camera = new PerspectiveCamera(75, this.displayWidth / this.displayHeight, 1.0, 5000);
        this.resetCameraProperties();

        this.scene = new Scene();

        const ambientLight = new AmbientLight(new Color(1, 1, 0.7), 0.15);
        const directionalLight = new DirectionalLight(new Color(1, 1, 0.9), 1);
        directionalLight.position.set(1, 1, 10);

        this.material = new MeshLambertMaterial({
            flatShading: true,
            vertexColors: VertexColors
        });

        // this.scene.add(controls as unknown as Object3D);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(this.terrain.mesh);

        // this.addCubeToTestRendering();

        this.frameCounter = 0;

        const controls = new OrbitControls(this.camera, this.canvas);
        controls.update();

        StaticTerrainRenderer.render();
    }

    static render() {
        // Refactored resize check into a debounced event listener.
        /* const debouncedResize = debounce(() => { this.level.resize(); }, 50);
        window.addEventListener("resize", (e) => {
            debouncedResize();
        });
*/
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);

        this.frameCounter++;
    }

    static resize(width: number, height: number) {
        this.renderer.setSize(width, height, false);
    }

    private static addCubeToTestRendering() {
// Add a cube to test rendering
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({color: 0x00ff00});
        const cube = new Mesh(geometry, material);
        this.scene.add(cube);
    }

    private static resetCameraProperties() {
        this.camera.up.set(0, 0, 1);
        // this.camera.position.z = 3;
        this.camera.position.set(200, -200, 200);
        // this._camera.position.set(1, 1.5, 1);
        this.camera.lookAt(new Vector3(0, 0, 0));
        //this.camera.updateProjectionMatrix();
    }

}