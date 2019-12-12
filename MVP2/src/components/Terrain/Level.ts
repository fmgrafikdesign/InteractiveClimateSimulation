import {Terrain} from "./TerrainMatthias";
import {
	AmbientLight,
	AxesHelper,
	BoxGeometry,
	Color,
	DirectionalLight,
	Geometry,
	Light,
	Material,
	Mesh,
	MeshLambertMaterial,
	Object3D,
	PerspectiveCamera,
	Scene,
	Vector3
} from "three";
import TerrainRenderer from "./TerrainRenderer";
import {Vnode} from "mithril";
import {OrbitControls} from "three-orbitcontrols-ts";
import {ITerrainGenerator} from "./Generators/ITerrainGenerator";
import {MapTerrainGenerator} from "./Generators/MapTerrainGenerator";
import IMessageReceiver from "../MessageSystem/IMessageReceiver";
import IMessage from "../MessageSystem/IMessage";
import IMessageSender from "../MessageSystem/IMessageSender";
import VariableChangedMessage from "../MessageSystem/VariableChangedMessage";


export default class Level implements IMessageReceiver
{
	private _terrain: Terrain;
	private _camera: PerspectiveCamera;
	private _scene: Scene;
	private ligths: Light[];
	private renderer: TerrainRenderer;
	private parent: Object3D;
	
	private canvasWidth: number;
	private canvasHeight: number;
	private defaultMeshFaceMaterial: Material;

	constructor(vnode: Vnode<any>)
	{
		console.log("Starting level");
		console.log(vnode);
		this._terrain = this.getConfiguredTerrain(vnode.attrs.config);
		this._terrain.addReceiver(this);

		this._camera = new PerspectiveCamera();
		this._scene = new Scene();
		this.ligths = [];
		this.renderer = new TerrainRenderer(this);
		this.parent = new Object3D();
		this.defaultMeshFaceMaterial = new MeshLambertMaterial({color: new Color(1, 0.8, 0.5), wireframe: false, flatShading: true});
		
		this.canvasWidth = 100;
		this.canvasHeight = 100;

		this.setup();
	}

	view(vnode: Vnode)
	{
		console.log("Getting into level view");
	}

	getConfiguredTerrain(config: object): Terrain
	{
		let generator: ITerrainGenerator = new MapTerrainGenerator();

		//options.forEach((value) => {if (value.type == config.type) {generator = value;}});

		return generator.generate();
	}

	setTerrain(terrain: Terrain)
	{
		this._terrain.removeReceiver(this);
		
		this._terrain = terrain;
		this._terrain.addReceiver(this);
		this.setup();
	}

	testIfResized()
	{

		console.log("Testing if the frame needs to be resized");
		const canvas = this.renderer.canvas;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = this.canvasWidth !== width || this.canvasHeight !== height;
		if (needResize)
		{
			this.renderer.resize(width, height);
			this.getCanvasDimensions();
			this.resetCameraProperties();

			console.log("Canvas set to: width: {0}, height: {1}", width, height);
		}
		return needResize;
	}

	private setup(): void
	{
		this.setupCanvas();
		this.setupScene();

		this.renderer.animate();
	}

	private setupCanvas()
	{
		console.log("Setting up the canvas");

		this.getCanvasDimensions();
		this.setupCamera();


		/**
		 * Set up the scene & all standard objects in it
		 * @type {Scene}
		 */
		this._scene = new Scene();
		let axesHelper = new AxesHelper(3);
		let controls = new OrbitControls(this._camera, this.renderer.canvas);

		let ambientLight = new AmbientLight(new Color(1, 1, 0.7), 0.15);
		let directionalLight = new DirectionalLight(new Color(1, 1, 0.9), 1);
		directionalLight.position.set(1, 1, 10);

		this.ligths.push(ambientLight, directionalLight);


		//this.scene.add(axesHelper);
		this.scene.add(controls as unknown as Object3D);
		this._scene.add(ambientLight);
		this._scene.add(directionalLight);
	}

	private setupScene()
	{
		console.log("Setting up the scene");
		/**
		 * Create a cube and add it to the scene
		 * @type {BoxGeometry|BoxGeometry}
		 */
		let cubeGeometry = new BoxGeometry(1, 1, 1);
		
		this.changeGeometry();

		this._scene.add(this.parent);

		/** Test cube
        const cube = new Mesh(cubeGeometry, material);
        cube.castShadow = true;
        //cube.position.z = 6;
        this.scene.add(cube); */
	}
	
	private changeGeometry(geometry: Geometry = this._terrain.mesh.geometry as Geometry)
	{
		const tempGeometry: Geometry = geometry;
		this.parent.remove(this._terrain.mesh);
		this._terrain.mesh.geometry.dispose();
		
		this._terrain.mesh = new Mesh(tempGeometry, this.defaultMeshFaceMaterial);
		
		this.parent.add(this._terrain.mesh);
		
		this.resetCameraProperties();
	}

	private getCanvasDimensions()
	{
		this.canvasWidth = this.renderer.canvas.width;
		this.canvasHeight = this.renderer.canvas.height;
	}

	private setupCamera()
	{
		this._camera = new PerspectiveCamera(75, 1, 0.1, 5000);
		this.resetCameraProperties();
	}

	private resetCameraProperties()
	{
		this._camera.up.set(0, 0, 1);
		// this.camera.position.z = 3;
		this._camera.position.set(700, -700, this._terrain.getHighestPoint() * 1.3);
		// this._camera.position.set(1, 1.5, 1);
		this._camera.lookAt(new Vector3(0, 0, 0));
		this._camera.aspect = this.canvasWidth / this.canvasHeight;
		this._camera.updateProjectionMatrix();
	}

	rotateCameraAroundCenter(degreesToRotate: number)
	{

	}
	
	get terrain(): Terrain
	{
		return this._terrain;
	}
	
	get camera(): PerspectiveCamera
	{
		return this._camera;
	}
	
	get scene(): Scene
	{
		return this._scene;
	}
	
	receiveMessage(message: IMessage, sender: IMessageSender): void
	{
		const convertedMessage: VariableChangedMessage = message as VariableChangedMessage;
		if (convertedMessage.variablesThatChanged[0] === "mesh")
		{
			this.changeGeometry();
		}
	}
}
