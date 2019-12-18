import webmidi from 'webmidi';
import SimulationController from "../Simulation/SimulationController";
import TerrainRenderer from "../Terrain/TerrainRenderer";
import TerrainController from "../Terrain/TerrainController";
import {Color} from "three";

const MIDIEventReceiver = {
    initialize: () => {
        webmidi.enable(err => {
            if(err) {
                console.warn("WebMidi could not be enabled.", err);
            } else {
                console.info("WebMidi successfully enabled. Available inputs:");
                console.log(webmidi.inputs);

                let input = webmidi.inputs[0];
                input.addListener('noteon', undefined, (e) => {
                    console.log(e);
                    // Last three white notes on the piano on the right side
                    if(e.note.number == 93) {
                        // Control position
                        //TerrainController.setX(e.velocity);
                        TerrainController.rotateCameraUpDown(e.velocity);
                        console.log("setX");
                    } else if(e.note.number == 94) {
                        // Control color
                        //TerrainController.setColor(new Color(0, e.velocity, 0))
                        TerrainController.rotateCameraLeftRight(e.velocity);
                    } else if (e.note.number == 95) {
                        // Control size
                        //TerrainController.setSize(e.velocity);
                        TerrainController.panCameraForward(e.velocity);
                    }

                })
            }
        });
    }
};

const MIDIEventController = {

};

export default MIDIEventReceiver;