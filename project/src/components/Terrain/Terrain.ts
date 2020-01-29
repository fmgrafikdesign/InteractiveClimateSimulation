import * as THREE from "three";
import {Color} from "three";

class Terrain {
    private static _instance: Terrain;
    public geometry: THREE.BoxGeometry;
    public material: THREE.MeshPhongMaterial;
    public cube: THREE.Mesh;
    public scene: THREE.Scene;
    public camera: THREE.Camera;
    public renderer: THREE.WebGLRenderer;
    public light: THREE.PointLight;

    private constructor() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshPhongMaterial( {color: 0x00ff00 });
        this.cube = new THREE.Mesh( this.geometry, this.material);
        this.setX(0);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.light = new THREE.PointLight(0xffffff, 1, 100);
        this.light.position.set(0, 0, 5);
        this.scene.add(this.light);
        this.scene.add(this.cube);
        this.camera.position.z = 8;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    setX(x: number) {
        this.cube.position.x = (-64 + x*128) / 20;
    }

    setColor(color: Color) {
        this.material.color = color;
    }

    setSize(size: number) {
        this.cube.scale.set(size*2, size*2, size*2);
    }
}

export default Terrain;