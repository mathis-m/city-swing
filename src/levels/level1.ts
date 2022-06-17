import {
    BoxGeometry,
    Mesh,
    MeshStandardMaterial, Renderer,
    RepeatWrapping,
    Scene,
    sRGBEncoding,
    TextureLoader,
    Vector3, WebGLRenderer
} from "three";
import {WorldObjectData, WorldObjectTags} from "../game-objects/world";

export interface Level {
    init(scene: Scene, renderer: WebGLRenderer): void;
    getSpawnLocation(): Vector3;
}

export class Level1 implements Level {
    private spawn = new Vector3(0, 150, 0);
    private renderer!: WebGLRenderer;
    private scene!: Scene;

    getSpawnLocation(): Vector3 {
        return this.spawn;
    }

    init(scene: Scene, renderer: WebGLRenderer): void {
        this.renderer = renderer;
        this.scene = scene;

        this.material = this.loadMaterial('vintage-tile1_', 0.2);

        let currentPos = this.spawn.clone()
        currentPos.y = 0;

        const gap = 2000;
        const buildingLength = 1000;
        for (let i = 0; i < 2; i++) {
            this.addBuilding(currentPos, buildingLength);
            this.addAttachable(this.getAttachablePosFromPrevBuilding(currentPos, buildingLength, gap));
            currentPos.z -= gap + buildingLength;
        }
    }

    private getAttachablePosFromPrevBuilding(position: Vector3, buildingLength: number, gap: number) {
        const width = 400
        const pos = position.clone();
        pos.z -= buildingLength + (gap / 2) - (width / 2);
        pos.y = 1500;
        pos.x = 0;

        return pos;
    }

    private addAttachable(position: Vector3) {
        const box = new Mesh(
            new BoxGeometry(400, 400, 400),
            this.loadMaterial('vintage-tile1_', 0.2)
        );
        box.position.copy(position);
        box.castShadow = true;
        box.receiveShadow = true;
        box.userData = {
            tags: [WorldObjectTags.Attachable, WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(box);
    }

    private material!: MeshStandardMaterial;
    private addBuilding(position: Vector3, buildingLength: number) {
        const building = new Mesh(
            new BoxGeometry(1000, 100, buildingLength),
            this.material
        );
        building.position.copy(position)
        building.castShadow = true;
        building.receiveShadow = true;
        building.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(building);
    }

    private loadMaterial(name: string, tiling: number) {
        const mapLoader = new TextureLoader();
        const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

        const metalMap = mapLoader.load('images/textures/' + name + 'metallic.png');
        metalMap.anisotropy = maxAnisotropy;
        metalMap.wrapS = RepeatWrapping;
        metalMap.wrapT = RepeatWrapping;
        metalMap.repeat.set(tiling, tiling);

        const albedo = mapLoader.load('images/textures/' + name + 'albedo.png');
        albedo.anisotropy = maxAnisotropy;
        albedo.wrapS = RepeatWrapping;
        albedo.wrapT = RepeatWrapping;
        albedo.repeat.set(tiling, tiling);
        albedo.encoding = sRGBEncoding;

        const normalMap = mapLoader.load('images/textures/' + name + 'normal.png');
        normalMap.anisotropy = maxAnisotropy;
        normalMap.wrapS = RepeatWrapping;
        normalMap.wrapT = RepeatWrapping;
        normalMap.repeat.set(tiling, tiling);

        const roughnessMap = mapLoader.load('images/textures/' + name + 'roughness.png');
        roughnessMap.anisotropy = maxAnisotropy;
        roughnessMap.wrapS = RepeatWrapping;
        roughnessMap.wrapT = RepeatWrapping;
        roughnessMap.repeat.set(tiling, tiling);

        return new MeshStandardMaterial({
            metalnessMap: metalMap,
            map: albedo,
            normalMap: normalMap,
            roughnessMap: roughnessMap,
        });
    }
}