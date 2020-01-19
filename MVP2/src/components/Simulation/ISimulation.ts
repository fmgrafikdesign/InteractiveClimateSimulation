export default interface ISimulation {
    // One-time setup if necessary
    setup(): void,
    // Each simulation tick this gets called
    tick(): void
}
