import ISimulation from "./ISimulation";
import {ITerrainColorModel} from "../Terrain/ColorModels/ITerrainColorModel";
import TemperatureHumidityColorModel from "../Terrain/ColorModels/TemperatureHumidityColorModel";
import HumidityColorModel from "../Terrain/ColorModels/HumidityColorModel";

export default class SimulationContext {
    private strategy: ISimulation | undefined;
    private colorModel: ITerrainColorModel | undefined;

    public setStrategy(simulationStrategy: ISimulation) {
        this.strategy = simulationStrategy;
    }

    public executeStrategy() {
        if (this.strategy) {
            return this.strategy.tick();
        }
    }

    public setupStrategy() {
        if(this.strategy) {
            return this.strategy.setup();
        }
    }

    public setColorModel(colorModel: ITerrainColorModel) {
        this.colorModel = colorModel;
    }

    getColorModel(): ITerrainColorModel {
        return (this.colorModel) ? this.colorModel : new HumidityColorModel();
    }
}