import m from 'mithril';
import Level from "./Level";
import {WebGLRenderer} from "three";

export default class TerrainRenderer {
    private level: Level;
    private renderer: WebGLRenderer;
    private readonly _canvas: HTMLCanvasElement;
    private frameCounter: number;

    constructor(level: Level)
    {
        if (!document.getElementById("Canvas"))
        {
            console.log("Trying to generate a canvas element");
            const canvasContainer = document.createElement("div");
            canvasContainer.id = "Canvas-Container";
            const canvas = document.createElement("canvas");
            canvas.id = "Canvas";
            document.body.appendChild(canvasContainer);
            canvasContainer.appendChild(canvas);
            m("canvas", {id: "Canvas", class: "Canvas"});
        }
        this.level = level;
        this._canvas = document.getElementById("Canvas") as HTMLCanvasElement;
        const parameters = {canvas: this._canvas, antialias: true, castShadows: true};
        this.renderer = new WebGLRenderer(parameters);
        this.frameCounter = 0;
    }

    oninit({attrs}: any) {

    }

    oncreate(vnode: m.Vnode<any, any>) {
        this.level = new Level(vnode.attrs.terrain);
        // vnode.dom.appendChild(this.level.renderer.domElement);
        // this.animate();
    }

    view({attrs} : any) {
        // return m('.terrain-renderer', terrain.renderer.domElement);
    }

    animate() {
        if (this.frameCounter % 100 === 0)
        {
            this.level.testIfResized();
        }
        // terrain.cube.rotation.x += 0.01;
        // terrain.cube.rotation.y += 0.01;
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.level.scene, this.level.camera);

        // console.log("Rendering frame");
        this.frameCounter++;
    }

    resize(width: number, height: number)
    {
        this.renderer.setSize(width, height, false);
    }

    get canvas(): HTMLCanvasElement
    {
        return this._canvas;
    }
}
