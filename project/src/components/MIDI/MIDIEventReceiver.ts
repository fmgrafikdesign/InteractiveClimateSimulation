import webmidi from 'webmidi';
import Simulation from "../Simulation/Simulation";
import m from "mithril";
import TemperatureColorModel from "../Terrain/ColorModels/TemperatureColorModel";
import HeightColorModel from "../Terrain/ColorModels/HeightColorModel";
import HumidityColorModel from "../Terrain/ColorModels/HumidityColorModel";
import TemperatureHumidityColorModel from "../Terrain/ColorModels/TemperatureHumidityColorModel";
import LegacyTemperatureColorModel from "../Terrain/ColorModels/LegacyTemperatureColorModel";
import LegacyTemperatureHumidityColorModel from "../Terrain/ColorModels/LegacyTemperatureHumidityColorModel";

const colorModels = [new HeightColorModel(), new LegacyTemperatureColorModel(), new LegacyTemperatureHumidityColorModel(), new HumidityColorModel()];
let buttoncounter = 0;

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
                        // Control Sun Energy Input
                        Simulation.temperatureChangePerTick = (e.velocity - 0.5);

                    } else if(e.note.number == 94) {
                        Simulation.humidityChangePerTick = (e.velocity - 0.5) / 20;
                    } else if (e.note.number == 95) {

                    } else if(e.note.number == 0) {
                        buttoncounter++;
                        // Change visualisation strategy
                        console.log("Changing visualisation strategy to: ", colorModels[buttoncounter%colorModels.length]);
                        Simulation.context.setColorModel(colorModels[buttoncounter%colorModels.length]);
                    }
                    m.redraw();

                });
            }
        });
    }
};

const MIDIEventController = {

};

export default MIDIEventReceiver;