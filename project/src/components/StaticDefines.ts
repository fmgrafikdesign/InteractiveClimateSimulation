
export default class StaticDefines {
    /**
     * Defines, by how much the vertex rises for each water unit, that is additionally put onto it if this vertex already is completely wet
     */
    public static readonly heightIncreasePerWaterUnit: number = 0.2;


    public static readonly zeroCelsiusInKelvin: number = 273.15;


    /**
     * Thermal conductivity values
     *
     * Thermal conductivity: The amount of energy (in Watts) you have to input (per kg of substance I think), to increase the temperature by 1 Kelvin
     * The values are taken from this website: https://www.engineeringtoolbox.com/thermal-conductivity-d_429.html
     */

    /**
     * The thermal conductivity of water
     */
    public static readonly thermalConductivityWater: number = 600;

    /**
     * The thermal conductivity of dirt.
     */
    public static readonly thermalConductivityDirtVeryMoist: number = 1400;
    public static readonly thermalConductivityDirtMoist: number = 1000;
    public static readonly thermalConductivityDirtDry: number = 500;
    public static readonly thermalConductivityDirtVeryDry: number = 330;

    /**
     * The thermal conductivity of air.
     */
    public static readonly thermalConductivityAir: number = 26;
}