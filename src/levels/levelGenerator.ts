import {
    BoxGeometry,
    Color,
    Mesh,
    MeshStandardMaterial,
    RepeatWrapping,
    Scene,
    sRGBEncoding,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";
import {WorldObjectData, WorldObjectTags} from "../game-objects/world";

export interface Level {
    init(scene: Scene, renderer: WebGLRenderer): void;
    update(scene: Scene, renderer: WebGLRenderer): void;

    getSpawnLocation(): Vector3;
}

export interface Challenge {
    init(scene: Scene, renderer: WebGLRenderer, pos: Vector3): [Vector3, WorldObjectData];
}
const materials: Record<string, MeshStandardMaterial> = {};
const loadMaterial = (name: string, tiling: number, renderer: WebGLRenderer) => {
    const key = `${name}_${tiling}`;
    if(key in materials) {
        return materials[key];
    }
    const mapLoader = new TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

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

    const mat = new MeshStandardMaterial({
        metalnessMap: metalMap,
        map: albedo,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
    });

    materials[key] = mat;
    return mat;
}

export class SimpleSwingChallenge implements Challenge {
    private renderer!: WebGLRenderer;
    private static material?: MeshStandardMaterial;

    init(scene: Scene, renderer: WebGLRenderer, pos: Vector3): [Vector3, WorldObjectData] {
        this.renderer = renderer;
        if (SimpleSwingChallenge.material === undefined)
            SimpleSwingChallenge.material = loadMaterial('vintage-tile1_', 0.2, renderer);

        const building = new Mesh(
            new BoxGeometry(2000, 2000, 4000),
            SimpleSwingChallenge.material
        );
        const gap = 6000;
        building.position.copy(pos)
        building.position.y -= 1000
        building.position.z -= gap + 2000
        building.castShadow = true;
        building.receiveShadow = true;
        const data = {
            tags: [WorldObjectTags.Collision, WorldObjectTags.Platform]
        } as WorldObjectData;
        building.userData = data;
        scene.add(building);


        const width = 400
        const posAttachable = pos.clone();
        posAttachable.z -= (gap / 3) - (width / 2);
        posAttachable.y += 2500;

        const box = new Mesh(
            new BoxGeometry(400, 400, 400),
            SimpleSwingChallenge.material
        );
        box.position.copy(posAttachable);
        box.castShadow = true;
        box.receiveShadow = true;
        box.userData = {
            tags: [WorldObjectTags.Attachable, WorldObjectTags.Collision]
        } as WorldObjectData;
        scene.add(box);

        const nextPos = pos.clone();
        nextPos.z -= gap + 4000;
        return [nextPos, data];
    }
}
export class NSwingChallenge implements Challenge {
    private renderer!: WebGLRenderer;
    private static material?: MeshStandardMaterial;

    init(scene: Scene, renderer: WebGLRenderer, pos: Vector3): [Vector3, WorldObjectData] {
        const n = Math.floor(Math.random() * 5) + 1;
        this.renderer = renderer;
        if (NSwingChallenge.material === undefined)
            NSwingChallenge.material = loadMaterial('vintage-tile1_', 0.2, renderer);

        const building = new Mesh(
            new BoxGeometry(2000, 2000, 4000),
            NSwingChallenge.material
        );
        const gap = 6000 * n;
        building.position.copy(pos)
        building.position.y -= 1000
        building.position.z -= gap + 2000
        building.castShadow = true;
        building.receiveShadow = true;
        const data = {
            tags: [WorldObjectTags.Collision, WorldObjectTags.Platform]
        } as WorldObjectData;
        building.userData = data;
        scene.add(building);


        const width = 400
        const posAttachable = pos.clone();
        posAttachable.y += 2500;

        for (let i = 0; i < Math.max(n -1, 1); i++) {
            posAttachable.z -= (gap / (n === 1 ? 3 : n)) - (width / 2);

            const box = new Mesh(
                new BoxGeometry(400, 400, 400),
                NSwingChallenge.material
            );
            box.position.copy(posAttachable);
            box.castShadow = true;
            box.receiveShadow = true;
            box.userData = {
                tags: [WorldObjectTags.Attachable, WorldObjectTags.Collision]
            } as WorldObjectData;
            scene.add(box);
        }


        const nextPos = pos.clone();
        nextPos.z -= gap + 4000;
        return [nextPos, data];
    }
}

export class CornerSwingChallenge implements Challenge {
    private renderer!: WebGLRenderer;
    private static material?: MeshStandardMaterial;
    private static isLeft: boolean = true;

    init(scene: Scene, renderer: WebGLRenderer, pos: Vector3): [Vector3, WorldObjectData] {
        this.renderer = renderer;
        if (CornerSwingChallenge.material === undefined)
            CornerSwingChallenge.material = loadMaterial('vintage-tile1_', 0.2, renderer);

        const isLeft = CornerSwingChallenge.isLeft;
        const building = new Mesh(
            new BoxGeometry(4000, 2000, 2000),
            CornerSwingChallenge.material
        );
        const gap = 6000;
        building.position.copy(pos)
        building.position.y -= 1000
        building.position.z -= gap + 2000
        building.position.x = isLeft ? building.position.x - (gap + 2000) : building.position.x + (gap + 2000)
        building.castShadow = true;
        building.receiveShadow = true;
        const data = {
            tags: [WorldObjectTags.Collision, WorldObjectTags.Platform]
        } as WorldObjectData;
        building.userData = data;
        scene.add(building);
        const concreteMaterial = loadMaterial('concrete3-', 4, renderer);

        const wallBox1 = new Mesh(
            new BoxGeometry(4000, 10000, 100),
            concreteMaterial
        );
        const posWallBox1 = pos.clone();
        posWallBox1.z -= gap + 900
        posWallBox1.x = isLeft ? posWallBox1.x - (gap + 2000) : posWallBox1.x + (gap + 2000)
        wallBox1.position.copy(posWallBox1);
        wallBox1.castShadow = true;
        wallBox1.receiveShadow = true;
        wallBox1.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        scene.add(wallBox1);

        const wallBox2 = new Mesh(
            new BoxGeometry(100, 10000, 4000),
            concreteMaterial
        );
        const posWallBox2 = pos.clone();
        posWallBox2.z -= (gap + 2000);
        posWallBox2.x = isLeft ? posWallBox2.x - (gap + 4060) : posWallBox2.x + (gap + 4060)
        wallBox2.position.copy(posWallBox2);
        wallBox2.castShadow = true;
        wallBox2.receiveShadow = true;
        wallBox2.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        scene.add(wallBox2);


        const width = 400
        const posAttachable = pos.clone();
        posAttachable.z -= gap - (width / 2) - 1000;
        posAttachable.y += 2500;

        const box = new Mesh(
            new BoxGeometry(400, 400, 400),
            CornerSwingChallenge.material
        );
        box.position.copy(posAttachable);
        box.castShadow = true;
        box.receiveShadow = true;
        box.userData = {
            tags: [WorldObjectTags.Attachable, WorldObjectTags.Collision]
        } as WorldObjectData;
        scene.add(box);


        const wall1 = new Mesh(
            new BoxGeometry(100, 10000, gap),
            concreteMaterial
        );
        const posWall1 = pos.clone();
        posWall1.z -= gap / 2
        posWall1.x = isLeft ? posWall1.x - width : posWall1.x + width
        wall1.position.copy(posWall1);
        wall1.castShadow = true;
        wall1.receiveShadow = true;
        wall1.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        scene.add(wall1);


        const nextPos = pos.clone();
        nextPos.z -= gap + 3000
        nextPos.x = isLeft ? nextPos.x - (gap + 2000) : nextPos.x + (gap + 2000);
        CornerSwingChallenge.isLeft = !CornerSwingChallenge.isLeft;
        return [nextPos, data];
    }
}


export class SpawnChallenge implements Challenge {
    private renderer!: WebGLRenderer;
    private static material?: MeshStandardMaterial;

    init(scene: Scene, renderer: WebGLRenderer, pos: Vector3): [Vector3, WorldObjectData] {
        this.renderer = renderer;
        if (SpawnChallenge.material === undefined)
            SpawnChallenge.material = loadMaterial('vintage-tile1_', 0.2, renderer);

        const building = new Mesh(
            new BoxGeometry(2000, 2000, 4000),
            SpawnChallenge.material
        );
        building.position.copy(pos)
        building.position.y -= 1000
        building.castShadow = true;
        building.receiveShadow = true;
        const data = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        building.userData = data;
        scene.add(building);

        const nextPos = pos.clone();
        nextPos.z -= 2000
        return [nextPos, data];
    }


}


export class DebugPos implements Challenge {
    init(scene: Scene, renderer: WebGLRenderer, pos: Vector3): [Vector3, WorldObjectData] {

        const building = new Mesh(
            new BoxGeometry(100, 100, 100),
            new MeshStandardMaterial({color: new Color(0xFF0015)})
        );
        building.position.copy(pos)
        building.castShadow = true;
        building.receiveShadow = true;
        scene.add(building);

        return [pos.clone(), {}];
    }


}

export class LevelGenerator implements Level {
    private spawn = new Vector3(0, 150, 0);
    private renderer!: WebGLRenderer;
    private scene!: Scene;

    getSpawnLocation(): Vector3 {
        return this.spawn;
    }

    private simpleSwingChallenge = new SimpleSwingChallenge();
    private cornerSwingChallenge = new CornerSwingChallenge();
    private nSwingChallenge = new NSwingChallenge()
    private allChallenges: Challenge[] = [
        this.simpleSwingChallenge,
        this.cornerSwingChallenge,
        this.cornerSwingChallenge,
        this.nSwingChallenge
    ];

    private nextPos: Vector3 = this.spawn.clone();

    private lastPlatformUserData: WorldObjectData[] = [];

    init(scene: Scene, renderer: WebGLRenderer): void {
        this.renderer = renderer;
        this.scene = scene;
        const debugPos = new DebugPos();

        const spawnChallenge = new SpawnChallenge();


        this.nextPos.y = 0;
        const [nextPos, data] = spawnChallenge.init(scene, renderer, this.nextPos)
        this.nextPos = nextPos;
        debugPos.init(scene, renderer, this.nextPos);
        this.render10Challenges(scene, renderer);
    }

    update(scene: Scene, renderer: WebGLRenderer): void {
        const collected = this.lastPlatformUserData.findIndex(x => x.isCollected) !== -1;
        if(!collected) return;

        this.lastPlatformUserData.length = 0;
        this.render10Challenges(scene, renderer)
    }

    private render10Challenges(scene: Scene, renderer: WebGLRenderer) {
        const debugPos = new DebugPos();

        for (let i = 0; i < 5; i++) {
            const n = Math.floor(Math.random() * this.allChallenges.length);
            console.log(n)
            const [nextPos, data]  = this.allChallenges[n].init(scene, renderer, this.nextPos)
            this.nextPos = nextPos;
            debugPos.init(scene, renderer, this.nextPos);
            if(i > 2) {
                this.lastPlatformUserData.push(data);
            }
        }
    }
}