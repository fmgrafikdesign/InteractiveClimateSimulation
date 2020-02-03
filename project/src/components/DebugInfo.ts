import m from "mithril";
import Simulation from "./Simulation/Simulation";

const DebugInfo = {
    view: () => {
        return m('.debug-info-wrapper', [
            m('span', Math.round(Simulation.temperatureChangePerTick * 100) / 100),
            m('span', Math.round(Simulation.humidityChangePerTick * 100) / 100),
            //m('span', 'lastTick: ' + Simulation.lastTickTime + 'ms'),
            //m('span', 'averageTick: ' + (Math.round(Simulation.averageTickTime * 100) / 100) + 'ms'),
        ]);
    }
};

export default DebugInfo;
