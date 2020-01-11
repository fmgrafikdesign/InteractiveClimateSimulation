import {ITerrainGenerator} from "./ITerrainGenerator";
import Terrain from "../TerrainFabian";
import * as THREE from "three";
import {PlaneGeometry, Vector3} from "three";
import SimplexNoise from "simplex-noise";
import StaticTerrainRenderer from "../StaticTerrainRenderer";

const mapboxAccessToken = "pk.eyJ1IjoiZm1ncmFmaWtkZXNpZ24iLCJhIjoiY2s0YWFmY3B1MDF4bzNsbmkybWhheHhnOCJ9.FcQSDwWQH11Du2f3joMrKA";

export default class LngLatTerrainGenerator implements ITerrainGenerator {

    // If zoom level is above 15, tile size increases
    static getTileSize(zoomLevel: number): number {
        return (zoomLevel >= 15) ? 256 : 512;
    }

    static getHeightFromRGBA(r: number, g: number, b: number): number {
        return -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1); // in Uint8ClampedArray the values are store in RGBA
    }

    private static getTileIndices(longitude: number, latitude: number, zoomLevel: number = 14): Vector3 {
        const tileSize = LngLatTerrainGenerator.getTileSize(zoomLevel);
        const worldSize = tileSize * Math.pow(2, zoomLevel);
        const x = (180 + longitude) / 360 * worldSize;
        const yCoordinate = Math.log(Math.tan((45 + latitude / 2) * Math.PI / 180));
        const y = (180 - yCoordinate * (180 / Math.PI)) / 360 * worldSize;
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);
        return new Vector3(tileX, tileY, zoomLevel);
    }

    // Mt. Everest
    // private centerLatitude: number = 27.986065;
    // private centerLongitude: number = 86.922623;

    // Defaults to Hagenberg
    private centerLatitude: number = 14.515;
    private centerLongitude: number = 48.368;

    private zoomLevel: number = 13;

    // TODO incorporate zoom level
    generate(lat?: number, lng?: number, width: number = 512, height: number = 512, verticesX: number = 64, verticesY: number = 64): Terrain {
        if (lat) {
            this.centerLatitude = lat;
        }
        if (lng) {
            this.centerLongitude = lng;
        }

        let geometry = new THREE.PlaneGeometry(width, height, verticesX - 1, verticesY - 1);
        geometry.rotateX(-Math.PI / 2);
        let terrain = new Terrain(geometry);

        // Update the Terrain geometry as we finish processing the image.
        this.getTileDataAt(LngLatTerrainGenerator.getTileIndices(this.centerLongitude, this.centerLatitude, this.zoomLevel))
            .then((data: ImageData) => {
                geometry = this.generateGeometryFromMapboxElevationPNG(data, data.width, data.height, 10);
//                geometry.rotateX(-Math.PI / 2);
                StaticTerrainRenderer.updateTerrainGeometry(geometry);
            });
        return new Terrain(geometry, verticesX, verticesY, width, height);
    }

    generateTexture(width: number, height: number) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const c = canvas.getContext('2d');
        if (!c) {
            return;
        }

        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);

        return c.getImageData(0, 0, canvas.width, canvas.height);
    }


    generateGeometryFromMapboxElevationPNG(data: ImageData, width = 512, height = 512, simplifyFactor = 1) {
        // TODO Implement simplify factor
        simplifyFactor = 1;

        const geometry = new THREE.PlaneGeometry(width, height, data.width, data.height);

        let min_height = LngLatTerrainGenerator.getHeightFromRGBA(255, 255, 255);
        let max_height = 0;

        for (let currentYindex = 0; currentYindex < data.height; currentYindex++) {
            for (let currentXindex = 0; currentXindex < data.width; currentXindex++) {
                const n = (currentYindex * (data.width) + currentXindex);
                const nn = (currentYindex * (data.width + 1) + currentXindex);

                const r = data.data[n * 4];
                const g = data.data[n * 4 + 1];
                const b = data.data[n * 4 + 2];
                const computedHeight = LngLatTerrainGenerator.getHeightFromRGBA(r, g, b);

                // Store min and max heights
                if(min_height > computedHeight) min_height = computedHeight;
                if(max_height < computedHeight) max_height = computedHeight;

                /* TODO Calculate a proper way of putting the height in relation to approx. size in m per tile pixel. */
                /* https://docs.mapbox.com/help/glossary/zoom-level/ */
                /* TODO Remember to factor in latitude in the calculation, as it skews m/px. */
                /* Example: Zoom Level 13 equator - 9.555m/px. Norway (~80lat) - 4.777m/px. Whoa. */
                //vertice.z = map(computedHeight, 0, 1000, -50, 80);

                // With zoom level 13 and lat of 48, Hagenberg should be aprox. 6.800m/px
                // So every vertice in our terrain is about 7km apart.
                // That has nothing to do with the division by the way. I still need to properly calculate that.
                const vertice = geometry.vertices[nn];
                vertice.z = computedHeight / 7;
            }
        }
        return geometry;
    }

    async getTileDataAt(tileIndices: Vector3) {
        return new Promise<ImageData>((resolve, reject) => {
            // Construct the API request
            const query = "https://api.mapbox.com/v4/mapbox.terrain-rgb/" + tileIndices.z + "/" + tileIndices.x + "/" + tileIndices.y + "@2x.pngraw?access_token=" + mapboxAccessToken;
            console.log(query);

            const canvas = document.createElement("canvas");
            canvas.width = LngLatTerrainGenerator.getTileSize(tileIndices.z);
            canvas.height = LngLatTerrainGenerator.getTileSize(tileIndices.z);
            const context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

            if (context !== null) {
                const image = new Image();
                image.crossOrigin = "*";
                image.onload = () => {
                    context.drawImage(image, 0, 0);
                    resolve(context.getImageData(0, 0, canvas.width, canvas.height));
                };
                image.src = query;
            }
        });
    }
}

function map(val: number, smin: number, smax: number, emin: number, emax: number) {
    const t =  (val - smin) / (smax - smin);
    return (emax - emin) * t + emin;
}