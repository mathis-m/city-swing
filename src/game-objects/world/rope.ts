import {DoubleSide, MeshStandardMaterial, RepeatWrapping, Scene, TextureLoader, Vector3} from "three";
import {IK} from "../../utils/IK";

export class Rope extends IK {
    constructor(scene: Scene) {
        let loader = new TextureLoader();
        let material = new MeshStandardMaterial({
            map: loader.load("images/textures/ropeTexture/ropeDiff.png"),
            displacementMap: loader.load("images/textures/ropeTexture/ropeDisplacement.png"),
            metalnessMap: loader.load("images/textures/ropeTexture/ropeMetalic.png"),
            normalMap: loader.load("images/textures/ropeTexture/ropeNormal.png"),
            roughnessMap: loader.load("images/textures/ropeTexture/ropeRoughness.png"),
            color: 'rgb( 50, 50, 50)',
            side: DoubleSide
        });

        if (material.map)
            material.map.wrapT = material.map.wrapS = RepeatWrapping;

        if (material.displacementMap)
            material.displacementMap.wrapT = material.displacementMap.wrapS = RepeatWrapping;

        material.displacementScale = 0.05;

        if (material.metalnessMap)
            material.metalnessMap.wrapT = material.metalnessMap.wrapS = RepeatWrapping;

        if (material.normalMap)
            material.normalMap.wrapT = material.normalMap.wrapS = RepeatWrapping;

        if (material.roughnessMap)
            material.roughnessMap.wrapT = material.roughnessMap.wrapS = RepeatWrapping;

        super(material, scene);
        this.hide();

    }

    update(base: Vector3, target: Vector3) {
        this.base.copy(base);
        this.pointSegments(target);
        this.translateToBase();
        this.show();
    }

    set(base: Vector3, length: number) {
        this.base.copy(base);
        this.segments[this.segments.length - 1].follow(base);
        this.setLength(length * 0.8);
    }

    hide() {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].hide();
        }
    }
}