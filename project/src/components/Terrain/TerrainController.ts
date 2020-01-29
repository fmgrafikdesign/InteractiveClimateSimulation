import Terrain from "./Terrain";
import {Color} from "three";

const terrain: Terrain = Terrain.Instance;

const TerrainController = {
        setX: (velocity: number) => {
            terrain.setX(velocity);
        },

        setColor: (color: Color) => {
            terrain.setColor(color);
        },
        setSize: (size: number) => {
            terrain.setSize(size);
        },

        rotateCameraUpDown: (velocity: number) =>
        {
            
        },
        rotateCameraLeftRight: (velocity: number) =>
        {

        },
        panCameraForward: (velocity: number) =>
        {

        }
    }
;

export default TerrainController;