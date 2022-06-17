import {CylinderBufferGeometry, CylinderGeometry, Mesh, MeshStandardMaterial, Scene, Vector3} from "three";

export class Segment {
    private scene: Scene;
    private length: number;
    private readonly object: Mesh<CylinderGeometry, MeshStandardMaterial>;
    private readonly direction: Vector3;
    private readonly target: Vector3;

    public readonly pointA: Vector3;
    public readonly pointB: Vector3;

    constructor(base: Vector3, direction: Vector3, length: number, material: MeshStandardMaterial, scene: Scene) {
        this.scene = scene;
        this.length = length;
        this.direction = direction.clone();
        this.direction.setLength(this.length);

        this.target = new Vector3();
        this.pointA = base.clone();

        this.pointB = new Vector3();
        this.pointB.copy(this.pointA);
        this.pointB.add(this.direction);

        //set repeat
        material.roughnessMap?.repeat.set(2, length * 50);
        material.normalMap?.repeat.set(2, length * 50);
        material.metalnessMap?.repeat.set(2, length * 50);
        material.map?.repeat.set(2, length * 100);

        this.object = new Mesh(
            new CylinderBufferGeometry(0.1, 0.1, 1, 8, 16, true),
            material
        );
        this.object.geometry.translate(0, 0.5, 0);
        this.object.visible = true;
        this.object.frustumCulled = false;
        this.object.updateMatrixWorld();
        scene.add(this.object);
    }


    follow(target: Vector3) {
        this.target.copy(target);

        this.pointB.copy(this.target);

        this.direction.copy(this.pointB);
        this.direction.sub(this.pointA);
        this.direction.setLength(this.length);


        this.pointA.subVectors(this.pointB, this.direction);
    }

    calculateB() {
        this.pointB.copy(this.pointA);
        this.pointB.add(this.direction);
    }

    setA(base: Vector3) {
        this.pointA.copy(base);
        this.calculateB();
    }

    setLength(length: number) {
        this.length = length;
        this.direction.setLength(this.length);

        //set repeat
        this.object.material.roughnessMap?.repeat.set(2, length * 0.75);
        this.object.material.normalMap?.repeat.set(2, length * 0.75);
        this.object.material.metalnessMap?.repeat.set(2, length * 0.75);
        this.object.material.displacementMap?.repeat.set(2, length * 0.75);
        this.object.material.map?.repeat.set(2, length * 0.75);
    }

    show() {
        this.object.scale.y = this.length;
        this.object.position.copy(this.pointA.clone());
        this.object.quaternion.setFromUnitVectors(this.scene.up, this.direction.clone().normalize());

        this.object.visible = true;
    }

    hide() {
        this.object.visible = false;
        this.object.scale.y = 1;
    }
}