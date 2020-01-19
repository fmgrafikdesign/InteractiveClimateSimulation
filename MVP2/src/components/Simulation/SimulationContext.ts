import ISimulation from "./ISimulation";

export default class SimulationContext {
    private strategy: ISimulation | undefined;

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
}