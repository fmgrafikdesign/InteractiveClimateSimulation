import ISimulation from "./ISimulation";
import {ITerrainColorModel} from "../Terrain/ColorModels/ITerrainColorModel";
import HumidityColorModel from "../Terrain/ColorModels/HumidityColorModel";

export default class SimulationContext {
    private strategy: ISimulation | undefined;
    private colorModel: ITerrainColorModel | undefined;

    public setStrategy(simulationStrategy: ISimulation) {
        this.strategy = simulationStrategy;
    }

    public executeStrategy(deltaTime: number) {
        if (this.strategy) {
            return this.strategy.tick(deltaTime);
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