import webmidi from 'webmidi';
import Simulation from "../Simulation/Simulation";
import m from "mithril";

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