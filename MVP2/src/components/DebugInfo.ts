import m from "mithril";
import Simulation from "./Simulation/Simulation";

const DebugInfo = {
    view: () => {
        return m('.debug-info-wrapper', [
            m('span', 'temperatureChangePerTick: ' + Simulation.temperatureChangePerTick),
            m('span', 'temperatureChangePerTick: ' + Simulation.humidityChangePerTick),
            m('span', 'lastTick: ' + Simulation.lastTickTime + 'ms'),
            m('span', 'averageTick: ' + (Math.round(Simulation.averageTickTime * 100) / 100) + 'ms'),
        ]);
    }
};

export default DebugInfo;
