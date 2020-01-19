import m from "mithril";
import Simulation from "./Simulation/Simulation";

const DebugInfo = {
    view: () => {
        return m('.debug-info-wrapper', [
            m('span', 'temperatureChangePerTick: ' + Simulation.temperatureChangePerTick),
            m('span', 'lastTick: ' + Simulation.lastTickTime + 'ms'),
            m('span', 'averageTick: ' + (Math.round(Simulation.averageTickTime * 100) / 100) + 'ms'),
        ]);
    }
};

function stringToParagraph(str: string) {
    return '<p>' + str + '</p>';
}

export default DebugInfo;
