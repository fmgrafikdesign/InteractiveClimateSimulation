import {Vector3} from "three";
import {LngLat} from "mapbox-gl";

export default class MapboxMathUtils {
    // If zoom level is above 15, tile size increases
    public static getTileSize(zoomLevel: number): number {
        return (zoomLevel >= 15) ? 256 : 512;
    }

    public static getHeightFromRGBA(r: number, g: number, b: number): number {
        return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1); // in Uint8ClampedArray the values are store in RGBA
    }

    public static getTileIndices(longitude: number, latitude: number, zoomLevel: number = 13): Vector3 {
        const tileSize = this.getTileSize(zoomLevel);
        const worldSize = tileSize * Math.pow(2, zoomLevel);
        const x = (180 + longitude) / 360 * worldSize;
        const yCoordinate = Math.log(Math.tan((45 + latitude / 2) * Math.PI / 180));
        const y = (180 - yCoordinate * (180 / Math.PI)) / 360 * worldSize;
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);
        return new Vector3(tileX, tileY, zoomLevel);
    }

    public static getLongitudeLatitudeFromIndex(x: number, y: number, zoomLevel: number = 13): LngLat {
        const tileSize = this.getTileSize(zoomLevel);
        const worldSize = tileSize * Math.pow(2, zoomLevel);

        const longitude = x * (360 * tileSize) / worldSize - 180;
        const latitude = (Math.atan(Math.exp((-1) * ((y * 360 * tileSize / worldSize - 180) / 180 * Math.PI))) * 180 / Math.PI - 45) * 2;

        return new LngLat(longitude, latitude);
    }
}
