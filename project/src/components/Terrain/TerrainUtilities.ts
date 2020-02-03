import {PlaneGeometry, Vector2, Vector3} from "three";
import ClimateVertex from "./Baseclasses/ClimateVertex";
import ITerrain from "./ITerrain";


export default class TerrainUtilities {

    static fitGeometryInBounds(geometry: PlaneGeometry, width: number, height: number): PlaneGeometry {
        let fitGeometry: PlaneGeometry = geometry;
        let oldSize: Vector3 = new Vector3();

        geometry.computeBoundingBox();
        geometry.boundingBox.getSize(oldSize);

        fitGeometry.scale((width != 0 && oldSize.x != 0) ? width / oldSize.x : 1, (height != 0 && oldSize.y != 0) ? height / oldSize.y : 1, 1);

        return fitGeometry;
    }

    static interpolateShrinkVertexDensity(geometry: PlaneGeometry, nrOfSegmentsX: number, nrOfSegmentsY: number): PlaneGeometry {
        let size: Vector3 = new Vector3();
        geometry.boundingBox.getSize(size);
        let shrunkGeometry = new PlaneGeometry(size.x, size.y, nrOfSegmentsX - 1, nrOfSegmentsY - 1);

        let vertexAmount: Vector2 = this.getNrOfVerticesOfGeometry(geometry);

        let stepSizeX = vertexAmount.x / nrOfSegmentsX;
        let stepSizeY = vertexAmount.y / nrOfSegmentsY;

        shrunkGeometry.vertices.forEach((vertex, index) => {
            let mappedIndexX: number = Math.floor(index % nrOfSegmentsX * stepSizeX);
            let mappedIndexY: number = Math.floor(Math.floor(index / nrOfSegmentsY) * stepSizeY);

            vertex.x = geometry.vertices[mappedIndexX + mappedIndexY * vertexAmount.x].x;
            vertex.y = geometry.vertices[mappedIndexX + mappedIndexY * vertexAmount.x].y;
            vertex.z = geometry.vertices[mappedIndexX + mappedIndexY * vertexAmount.x].z;
            // TODO: iterate over all surrounding vertices, calculate their mean and set the according new vertex of the new geometry
        });


        return shrunkGeometry;
    }

    public static insertBorderVertices(geometry: PlaneGeometry): PlaneGeometry {
        const sizeOldGeometry: Vector2 = this.getNrOfVerticesOfGeometry(geometry);

        let newGeometry: PlaneGeometry = new PlaneGeometry(this.getWidth(geometry) + 1, this.getDepth(geometry) + 1, sizeOldGeometry.x, sizeOldGeometry.y);

        geometry.vertices.forEach((vertex, index) => {
            newGeometry.vertices[index + Math.floor(index / sizeOldGeometry.x)] = vertex;
        });

        const compareVertex1: ClimateVertex = newGeometry.vertices[newGeometry.vertices.length - 2] as ClimateVertex;
        const compareVertex2: ClimateVertex = newGeometry.vertices[newGeometry.vertices.length - 1 - sizeOldGeometry.x] as ClimateVertex;

        let lastVertex: ClimateVertex = newGeometry.vertices[newGeometry.vertices.length - 1] as ClimateVertex;

        compareVertex1.x = lastVertex.x;
        compareVertex1.y = lastVertex.y;
        compareVertex2.x = lastVertex.x;
        compareVertex2.y = lastVertex.y;

        return newGeometry;
    }

    /**
     * Tries to find out the amount of vertices per row and column for a given geometry
     * This method only works, if the geometry is consistent rectangular (the number of vertices does not change over the rows and columns), the first vertex is the one with the lowest x value and x is not the up axis
     * @param geometry The geometry to be analysed
     */
    public static getNrOfVerticesOfGeometry(geometry: PlaneGeometry): Vector2 {
        let counter: number = 0;
        let edgeFound = false;
        let previousValueX: number = geometry.vertices[0].x - 1;
        geometry.vertices.forEach((vertex) => {
            if (!edgeFound && previousValueX > vertex.x) {
                edgeFound = true;
            }

            if (!edgeFound) {
                previousValueX = vertex.x;
                counter++;
            }
        });

        return (edgeFound) ? new Vector2(counter, geometry.vertices.length / counter) : new Vector2();
    }

    public static smooth(geometry: PlaneGeometry, radius: number, strength: number, iterations: number = 5): PlaneGeometry {
        let vertexSize: Vector2 = this.getNrOfVerticesOfGeometry(geometry);
        let copyGeometry: PlaneGeometry = new PlaneGeometry(this.getWidth(geometry), this.getDepth(geometry), vertexSize.x - 1, vertexSize.y - 1);

        for (let iteration = 0; iteration < iterations; iteration++) {
            const verticesBefore = geometry.vertices;

            for (let y = 0; y < vertexSize.y; y++) {
                for (let x = 0; x < vertexSize.x; x++) {
                    let zSum = 0;
                    let counter = 0;

                    for (let ySmoothing = y - radius; ySmoothing < y + radius; ySmoothing++) {
                        for (let xSmoothing = x - radius; xSmoothing < x + radius; xSmoothing++) {
                            if (ySmoothing >= 0 && ySmoothing < vertexSize.y && xSmoothing >= 0 && xSmoothing < vertexSize.x && !(x === xSmoothing && y === ySmoothing)) {
                                zSum += verticesBefore[xSmoothing + ySmoothing * vertexSize.x].z;
                                counter++;
                            }
                        }
                    }

                    if (counter > 0) {
                        const zBefore = verticesBefore[x + y * vertexSize.x].z;
                        const zMiddle = zSum / counter;

                        const index: number = x + y * vertexSize.x;
                        copyGeometry.vertices[index] = new ClimateVertex(geometry.vertices[index].x, geometry.vertices[index].y, zBefore + (zMiddle - zBefore) * Math.max(0, Math.min(1, strength)), x, y);
                    }
                }
            }
        }

        console.debug("Smoothing done");

        return copyGeometry;
    }

    public static getWidth(geometry: PlaneGeometry): number {
        geometry.computeBoundingBox();

        let size: Vector3 = new Vector3();
        geometry.boundingBox.getSize(size);
        return size.x;
    }

    public static getDepth(geometry: PlaneGeometry): number {
        geometry.computeBoundingBox();

        let size: Vector3 = new Vector3();
        geometry.boundingBox.getSize(size);
        return size.y;
    }

    /*
    public static setYAsTargetHeight(geometry: PlaneGeometry, newValueForY: number = 0): void {
        geometry.vertices.forEach((vertex) => {
            (vertex as ClimateVertex).targetHeight = vertex.y;
            vertex.y = newValueForY;
        });
    }

    public static setTargetHeightAsY(geometry: PlaneGeometry): void {
        geometry.vertices.forEach((vertex) => {
            vertex.y = (vertex as ClimateVertex).targetHeight;
            (vertex as ClimateVertex).targetHeight = vertex.y;
        });
    }

     */

    public static getMaxHeight(terrain: ITerrain): number {
        let maxHeight = terrain.getVertices()[0].y;
        terrain.getVertices().forEach((vertex) => {
            maxHeight = Math.max(maxHeight, vertex.y);
        });
        return Math.round(maxHeight);
    }

    public static getMinHeight(terrain: ITerrain): number {
        let minHeight = 99999;
        terrain.getVertices().forEach((vertex) => {
                if (vertex.y >= .1) {
                    minHeight = Math.min(minHeight, vertex.y);
                }
            }
        );
        return Math.round(minHeight);
    }
}