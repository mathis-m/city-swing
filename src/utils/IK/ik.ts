import {MeshStandardMaterial, Scene, Vector3} from "three";
import {Segment} from "./segment";

export class IK {
    private rnd = 0.2 + Math.random() * 999;
    protected base = new Vector3();
    protected direction = new Vector3();
    protected segmentCount = 6;
    public length = this.segmentCount;
    protected segmentLength = this.length / this.segmentCount;
    protected segments: Segment[] = [];

    constructor(material: MeshStandardMaterial, scene: Scene) {
        this.initSegments(material, scene)
    }


    private initSegments(material: MeshStandardMaterial, scene: Scene) {
        this.segments[0] = new Segment(this.base, this.direction, this.segmentLength, material, scene);

        for (let i = 1; i < this.segmentCount; i++) {
            this.segments[i] = new Segment(
                this.segments[i - 1].pointB,
                this.direction,
                this.segmentLength,
                material,
                scene
            );
        }
    }


    pointSegments(target: Vector3) {
        this.segments[this.segments.length - 1].follow(target);

        for (let i = this.segments.length - 2; i >= 0; i--) {
            this.segments[i].follow(this.segments[i + 1].pointA);
        }

    }

    translateToBase() {
        this.segments[0].setA(this.base);

        for (let i = 1; i < this.segments.length; i++) {
            this.segments[i].setA(this.segments[i - 1].pointB);
        }
    }

    setLength(length: number) {
        this.length = length;
        this.segmentLength = this.length / this.segmentCount;

        this.segments.forEach(segment => {
            segment.setLength(this.segmentLength);
        });

    }

    show() {
        this.segments.forEach(segment => {
            segment.show();
        });
    }
}

