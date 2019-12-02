import m from 'mithril';
import * as THREE from 'three';
import Terrain from "./Terrain";

const terrain: Terrain = Terrain.Instance;

const TerrainRenderer: m.ClosureComponent = vnode => {
    return {
        oninit ({attrs}) {

        },
        oncreate (vnode) {
            vnode.dom.appendChild(terrain.renderer.domElement);
            animate(terrain);
        },
        view ({attrs}) {
            return m('.terrain-renderer', terrain.renderer.domElement);
        }
    };
};

function animate(terrain: Terrain) {
    terrain.cube.rotation.x += 0.01;
    terrain.cube.rotation.y += 0.01;
    requestAnimationFrame((timestamp) => animate(terrain));
    terrain.renderer.render(terrain.scene, terrain.camera);
}

export default TerrainRenderer;