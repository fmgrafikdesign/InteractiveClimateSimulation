import {
    AmbientLight,
    BoxGeometry,
    Camera,
    Color,
    DirectionalLight,
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    Vector3,
    VertexColors,
    WebGLRenderer
} from "three";
import {ITerrainGenerator} from "./Generators/ITerrainGenerator";
// import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";
import {Terrain} from "./TerrainFabian";
import LngLatTerrainGenerator from "./Generators/LngLatTerrainGenerator";
import {Error} from "tslint/lib/error";

export interface TerrainRendererInterface {
    render(): void;
}

export default class TerrainRenderer implements TerrainRendererInterface{
    generator: ITerrainGenerator = new LngLatTerrainGenerator();
    renderer: WebGLRenderer;
    canvas: HTMLCanvasElement;
    scene: Scene;
    camera: Camera;
    frameCounter: number;
    material: Material;
    displayWidth: number;
    displayHeight: number;
    terrain: Terrain | undefined;

    constructor(canvas: HTMLCanvasElement, terrain?: Terrain) {
        this.canvas = canvas;

        this.terrain = terrain;
        if (!this.terrain) {
            console.warn("No terrain was supplied to the TerrainRenderer, generating one.");
            this.terrain = this.generator.generate();
        }

        const parameters = {canvas: this.canvas, antialias: true, castShadows: true};
        this.renderer = new WebGLRenderer(parameters);
        if (!this.renderer) {
            throw new Error("Failed to create THREE.WebGLRenderer")
        }

        const rectangle = canvas.getBoundingClientRect();
        this.displayWidth = rectangle.width;
        this.displayHeight = rectangle.height;

        this.renderer.setSize(this.displayWidth, this.displayHeight);

        this.camera = new PerspectiveCamera(150, this.displayWidth / this.displayHeight, 1.0);
        // this.resetCameraProperties();

        this.scene = new Scene();

        const ambientLight = new AmbientLight(new Color(1, 1, 0.7), 0.15);
        const directionalLight = new DirectionalLight(new Color(1, 1, 0.9), 1);
        directionalLight.position.set(1, 1, 10);

        this.material = new MeshLambertMaterial({
            // wireframe: true,
            flatShading: true,
            vertexColors: VertexColors
        });

        // this.scene.add(controls as unknown as Object3D);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(this.terrain.mesh);

        // this.addCubeToTestRendering();

        this.frameCounter = 0;

        // const controls = new OrbitControls(this.camera, this.canvas);
        // controls.update();

        this.render();
    }

    render() {
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

    resize(width: number, height: number) {
        this.renderer.setSize(width, height, false);
    }

    updateTerrainGeometry(geometry: PlaneGeometry) {
        if (!this.terrain) {
            console.warn("Tried to updateTerrainMesh, but there is no terrain in the renderer.");
            return;
        }
        this.scene.remove(this.terrain.mesh);
        this.terrain.updateMesh(geometry);
        this.scene.add(this.terrain.mesh);
    }

    private addCubeToTestRendering() {
// Add a cube to test rendering
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({color: 0x00ff00});
        const cube = new Mesh(geometry, material);
        this.scene.add(cube);
    }

    private resetCameraProperties() {
        this.camera.up.set(0, 0, 1);
        // this.camera.position.z = 3;
        this.camera.position.set(20000, -20000, 20000);
        // this._camera.position.set(1, 1.5, 1);
        this.camera.lookAt(new Vector3(0, 0, 0));
        // this.camera.updateProjectionMatrix();
    }

}
