import webmidi from 'webmidi';
import SimulationController from "../Simulation/SimulationController";
import StaticTerrainRenderer from "../Terrain/StaticTerrainRenderer";
import TerrainController from "../Terrain/TerrainController";

const MIDIEventReceiver = {
    initialize: () => {
        webmidi.enable((err) => {
            if(err) {
                console.warn("WebMidi could not be enabled.", err);
            } else {
                console.info("WebMidi successfully enabled. Available inputs:");
                console.log(webmidi.inputs);

                const input = webmidi.inputs[0];
                input.addListener('noteon', undefined, (e) => {
                    // console.log(e);
                    // Last three white notes on the piano on the right side
                    if(e.note.number == 93) {
                        // Control position
                        const threshold = 65 + e.velocity * 40;
                        StaticTerrainRenderer.terrain.setWaterThreshold(threshold);
                        //console.log("set Water Threshold to ", threshold);

                    } else if(e.note.number == 94) {

                    } else if (e.note.number == 95) {

                    }

                })
            }
        });
    }
};

const MIDIEventController = {

};

export default MIDIEventReceiver;