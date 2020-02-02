import {ITerrainGenerator} from "./ITerrainGenerator";
import Terrain from "../TerrainFabian";
import * as THREE from "three";
import {Vector3} from "three";
import StaticTerrainRenderer from "../StaticTerrainRenderer";
import {LngLat} from "mapbox-gl";
import MapboxMathUtils from "./MapboxMathUtils";
import ITerrain from "../ITerrain";

// tslint:disable-next-line:max-line-length
const mapboxAccessToken = "pk.eyJ1IjoiZm1ncmFmaWtkZXNpZ24iLCJhIjoiY2s0YWFmY3B1MDF4bzNsbmkybWhheHhnOCJ9.FcQSDwWQH11Du2f3joMrKA";

export default class LngLatTerrainGenerator implements ITerrainGenerator {

    // Mt. Everest
    // private centerLatitude: number = 27.986065;
    // private centerLongitude: number = 86.922623;

    // Defaults to Hagenberg
    private centerLatitude: number = 14.515;
    private centerLongitude: number = 48.368;

    private zoomLevel: number = 13;

    // TODO incorporate zoom level
    generate(lat?: number, lng?: number, width: number = 512, height: number = 512, verticesX: number = 64, verticesY: number = 64): ITerrain {
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
        this.getTileDataAt(MapboxMathUtils.getTileIndices(this.centerLongitude, this.centerLatitude, this.zoomLevel))
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

        let min_height = MapboxMathUtils.getHeightFromRGBA(255, 255, 255);
        let max_height = 0;

        for (let currentYindex = 0; currentYindex < data.height; currentYindex++) {
            for (let currentXindex = 0; currentXindex < data.width; currentXindex++) {
                const n = (currentYindex * (data.width) + currentXindex);
                const nn = (currentYindex * (data.width + 1) + currentXindex);

                const r = data.data[n * 4];
                const g = data.data[n * 4 + 1];
                const b = data.data[n * 4 + 2];
                const computedHeight = MapboxMathUtils.getHeightFromRGBA(r, g, b);

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
            canvas.width = MapboxMathUtils.getTileSize(tileIndices.z);
            canvas.height = MapboxMathUtils.getTileSize(tileIndices.z);
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