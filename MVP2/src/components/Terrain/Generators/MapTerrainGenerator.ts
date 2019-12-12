import {PlaneGeometry, Vector2, Vector3} from "three";
import {ITerrainGenerator} from "./ITerrainGenerator";
import {Terrain} from "../TerrainMatthias";
import m from "mithril";
import CustomImageData from "./CustomImageData";

export class MapTerrainGenerator implements ITerrainGenerator {
    
    private width: number;
    private height: number;
    private verticesX: number;
    private verticesY: number;

    private centerLatitude: number;
    private centerLongitude: number;
    private zoomLevel: number;

    constructor() {
        this.width = 1;
        this.height = 1;
        this.verticesX = 1;
        this.verticesY = 1;

        // Values Traunstein
        this.centerLongitude = 13.8361;
        this.centerLatitude = 47.8722;
        this.zoomLevel = 10;

        // Values Hagenberg
        this.centerLongitude = 14.515;
        this.centerLatitude = 48.368;
        this.zoomLevel = 13;
    }

    generate(width: number = 1024, height: number = 1024, verticesX: number = 64, verticesY: number = 64): Terrain {
        this.width = width;
        this.height = height;
        this.verticesX = verticesX;
        this.verticesY = verticesY;
    
        let imageData: CustomImageData = this.getTileDataAt(MapTerrainGenerator.getTileIndices(this.centerLongitude, this.centerLatitude, this.zoomLevel));
        
        let planeGeometry: PlaneGeometry = new PlaneGeometry(width, height, verticesX - 1, verticesY - 1);
        let terrain = new Terrain(planeGeometry, this.verticesX, this.verticesY);
        imageData.addReceiver(terrain);

        const stepSizeX = this.width / this.verticesX;
        const stepSizeY = this.height / this.verticesY;

        //this.getTileDataAt(this.getLongitudeCoordinateForDataPoint(500), this.getLatitudeCoordinateForDataPoint(500), 15.5);

        console.log(imageData);

        /*
        while (!imageData.isDun())
        {
            console.log("waiting ...");
        }

        for (let y = 0; y < this.verticesY; y++) {
            for (let x = 0; x < this.verticesX; x++) {
                //console.log(x + ", " + y + ": " + imageData.getValueAt(x, y));

                this.vertices.push(new Vector3(-this.width / 2 + x * stepSizeX, -this.height / 2 + y * stepSizeY, 0));
            }
        }
    */

        //this.smoothTerrain(8, 0.5);

        return terrain;
    }

    private getLatitudeCoordinateForDataPoint(y: number): number {
        let latitudeDifference = this.width / 2 / 111111;

        return this.centerLatitude - latitudeDifference / 2 + latitudeDifference / (this.verticesY - 1) * y;
    }

    private getLongitudeCoordinateForDataPoint(x: number): number {
        let longitudeDifference = this.width / (2 * 111111 * Math.cos(this.centerLatitude));

        return this.centerLongitude - longitudeDifference / 2 + longitudeDifference / (this.verticesX - 1) * x;
    }

    private static getTileIndices(longitude: number, latitude: number, zoomLevel: number = 14): Vector3 {
        let tileSize = MapTerrainGenerator.getTileSize(zoomLevel);

        let worldSize = tileSize * Math.pow(2, zoomLevel);

        let x = (180 + longitude) / 360 * worldSize;
        let yCoordinate = Math.log(Math.tan((45 + latitude / 2) * Math.PI / 180));
        let y = (180 - yCoordinate * (180 / Math.PI)) / 360 * worldSize;

        let tileX = Math.floor(x / tileSize);
        let tileY = Math.floor(y / tileSize);

        return new Vector3(tileX, tileY, zoomLevel);
    }

    private getTileDataAt(tileIndices: Vector3): CustomImageData {
        // Construct the API request
        const query = "https://api.mapbox.com/v4/mapbox.terrain-rgb/" + tileIndices.z + "/" + tileIndices.x + "/" + tileIndices.y + "@2x.pngraw?access_token=pk.eyJ1IjoibXVlZ2dyb2dvbmRyb2xsYSIsImEiOiJjazJ4ZjEyY2kwYjBzM2dvbWVoYjF4MndnIn0.CkaTPt0RObUkNLIUiWSecg";
        console.log(query);

        let canvas = document.createElement("canvas");
        canvas.width = MapTerrainGenerator.getTileSize(tileIndices.z);
        canvas.height = MapTerrainGenerator.getTileSize(tileIndices.z);
        let context: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

        let totalImageData = new CustomImageData(canvas.width, canvas.height);
        let lastOut = 0;

        if (context !== null) {
            let image = new Image();
            image.crossOrigin = "*";

            image.onload = () => {
                context.drawImage(image, 0, 0);
                
                console.log("Image size: " + image.width + "x" + image.height);
                console.log("Canvas size: " + canvas.width + "x" + canvas.height);

                for (let x = 0; x < canvas.width; x++) {
                    for (let y = 0; y < canvas.height; y++) {
                        totalImageData.setValueAt(x, y, context.getImageData(x, y, 1, 1).data);

                        let currentStatus = Math.floor(100 * (x * canvas.height + y) / (canvas.width * canvas.height));

                        if (currentStatus !== lastOut) {
                            lastOut = currentStatus;
                            // console.log("Processing image: " + currentStatus + "%");
                        }
                    }
                }

                totalImageData.setDun();
            };

            image.src = query;
        }

        return totalImageData;

        /*
        m.request({method: 'GET', url: query, headers: {"Content-Type": "image/png"}}).then((features : any) => {

            console.log(features);
            return 0;
        })
            .catch(() => {
                console.log("Returning 0 as elevation");
                return 0;
            });

        return 0;
        */
    }

    private static getTileSize(zoomLevel: number): number {
        return (zoomLevel >= 15) ? 256 : 512;
    }

    public static getHeightFromRGBA(rgba: Uint8ClampedArray): number {
        return -10000 + ((rgba[0] * 256 * 256 + rgba[1] * 256 + rgba[2]) * 0.1); // in Uint8ClampedArray the values are store in RGBA
    }

    private getElevationAtViaTileQuery(longitude: number, latitude: number): any {
        let accessToken = 'pk.eyJ1IjoibXVlZ2dyb2dvbmRyb2xsYSIsImEiOiJjazJ4ZjEyY2kwYjBzM2dvbWVoYjF4MndnIn0.CkaTPt0RObUkNLIUiWSecg';
        console.log("Getting elevation at: " + [longitude, latitude]);

        // Construct the API request
        var query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/' + longitude + ',' + latitude + '.json?layers=contour&limit=50&access_token=' + accessToken;

        m.request({method: 'GET', url: query,}).then((features: any) => {
            // Get all the returned features
            const allFeatures = features.data.features;

            // Create an empty array to add elevation data to
            const elevations = [];
            // For each returned feature, add elevation data to the elevations array
            for (let i = 0; i < allFeatures.length; i++) {
                elevations.push(allFeatures[i].properties.ele);
            }

            // In the elevations array, find the largest value
            const highestElevation = Math.max(...elevations);

            console.log("Coordinates: " + [longitude, latitude] + ", Elevation: " + highestElevation);
            return highestElevation;
        })
            .catch(() => {
                console.log("Returning 0 as elevation");
                return 0;
            });
    }
}