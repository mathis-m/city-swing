import {
    BoxGeometry,
    Clock,
    CubeTextureLoader,
    HemisphereLight,
    Mesh,
    MeshStandardMaterial,
    OrthographicCamera,
    PCFSoftShadowMap,
    PerspectiveCamera,
    PlaneGeometry,
    RepeatWrapping,
    Scene,
    SpotLight,
    sRGBEncoding,
    TextureLoader,
    WebGLRenderer
} from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {Crosshair} from "./game-objects/gui";
import {Rope, WorldObjectData, WorldObjectTags} from "./game-objects/world";
import {CrosshairBehaviour} from "./behaviours";
import {TargetInfo} from "./utils";
import {Player} from "./game-objects/world/player";
import {Level1} from "./levels/level1";


export class App {
    private camera!: PerspectiveCamera;
    private scene!: Scene;
    private uiCamera!: OrthographicCamera;
    private uiScene!: Scene;

    private renderer!: WebGLRenderer;

    private crosshair!: Crosshair;
    private crosshairBehaviour: CrosshairBehaviour = new CrosshairBehaviour();

    private clock: Clock;
    private stats: Stats;
    private container: HTMLDivElement;

    private targetInfo: TargetInfo = new TargetInfo();

    private player: Player;

    constructor() {
        this.clock = new Clock();
        // @ts-ignore
        this.stats = new Stats();
        this.container = document.getElementById("app") as HTMLDivElement;

        this.initRenderer();

        this.initLights();

        this.initScene();

        this.player = new Player(this.camera, this.scene, this.renderer, this.targetInfo);

        // init controls
        // this.controls = new FirstPersonControls(this.camera, this.renderer.domElement, this.targetInfo, this.rope);
        // this.controls.movementSpeed = 150;
        // this.controls.lookSpeed = 0.1;

        this.onWindowResize();

        this.animate();
    }

    private initScene() {

        this.crosshair = new Crosshair(this.renderer, this.uiScene, this.camera.aspect);


        const level = new Level1();
        level.init(this.scene, this.renderer);
        let spawnLocation = level.getSpawnLocation();
        this.camera.position.copy(spawnLocation);


        const loader = new CubeTextureLoader();
        const texture = loader.load([
            'images/textures/posx.jpg',
            'images/textures/negx.jpg',
            'images/textures/posy.jpg',
            'images/textures/negy.jpg',
            'images/textures/posz.jpg',
            'images/textures/negz.jpg',
        ]);

        texture.encoding = sRGBEncoding;
        this.scene.background = texture;
        return

        const mapLoader = new TextureLoader();
        const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
        const checkerboard = mapLoader.load('images/textures/checkerboard.png');
        checkerboard.anisotropy = maxAnisotropy;
        checkerboard.wrapS = RepeatWrapping;
        checkerboard.wrapT = RepeatWrapping;
        checkerboard.repeat.set(32, 32);
        checkerboard.encoding = sRGBEncoding;

        const plane = new Mesh(
            new PlaneGeometry(10000, 10000, 10, 10),
            new MeshStandardMaterial({map: checkerboard}));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        plane.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(plane);

        const box = new Mesh(
            new BoxGeometry(400, 400, 400),
            this.loadMaterial('vintage-tile1_', 0.2)
        );
        box.position.set(10, 1000, 0);
        box.castShadow = true;
        box.receiveShadow = true;
        box.userData = {
            tags: [WorldObjectTags.Attachable, WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(box);

        const box2 = new Mesh(
            new BoxGeometry(1000, 200, 1000),
            this.loadMaterial('vintage-tile1_', 0.2)
        );
        box2.position.set(10, 200, 0);
        box2.castShadow = true;
        box2.receiveShadow = true;
        box2.userData = {
            tags: [WorldObjectTags.Attachable, WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(box2);

        const concreteMaterial = this.loadMaterial('concrete3-', 4);

        const wall1 = new Mesh(
            new BoxGeometry(10000, 10000, 400),
            concreteMaterial);
        wall1.position.set(0, -4000, -5000);
        wall1.castShadow = true;
        wall1.receiveShadow = true;
        wall1.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(wall1);

        const wall2 = new Mesh(
            new BoxGeometry(10000, 10000, 400),
            concreteMaterial);
        wall2.position.set(0, -4000, 5000);
        wall2.castShadow = true;
        wall2.receiveShadow = true;
        wall2.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(wall2);

        const wall3 = new Mesh(
            new BoxGeometry(400, 10000, 10000),
            concreteMaterial);
        wall3.position.set(5000, -4000, 0);
        wall3.castShadow = true;
        wall3.receiveShadow = true;
        wall3.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(wall3);

        const wall4 = new Mesh(
            new BoxGeometry(400, 10000, 10000),
            concreteMaterial);
        wall4.position.set(-5000, -4000, 0);
        wall4.castShadow = true;
        wall4.receiveShadow = true;
        wall4.userData = {
            tags: [WorldObjectTags.Collision]
        } as WorldObjectData;
        this.scene.add(wall4);
    }

    private initLights() {
        const distance = 5000.0;
        const angle = Math.PI / 4.0;
        const penumbra = 0.5;
        const decay = 1.0;

        const spotLight = new SpotLight(
            0xFFFFFF, 100.0, distance, angle, penumbra, decay);
        spotLight.castShadow = true;
        spotLight.shadow.bias = -0.00001;
        spotLight.shadow.mapSize.width = 4096;
        spotLight.shadow.mapSize.height = 4096;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 100;

        spotLight.position.set(2500, 2500, 0);
        spotLight.lookAt(0, 0, 0);
        this.scene.add(spotLight);

        const upColour = 0xFFFF80;
        const downColour = 0x808080;
        const hemiLight = new HemisphereLight(upColour, downColour, 0.5);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 400, 0);
        this.scene.add(hemiLight);
    }

    private initRenderer() {
        this.renderer = new WebGLRenderer({
            antialias: false
        });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = sRGBEncoding;

        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        // camera
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this.camera = new PerspectiveCamera(
            65,
            window.innerWidth / window.innerHeight,
            0.01,
            100000
        );
        //this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 150, 0);

        this.scene = new Scene();

        this.uiCamera = new OrthographicCamera(-1, 1, aspect, -1 * aspect, 1, 1000);
        this.uiScene = new Scene();
    }

    loadMaterial(name: string, tiling: number) {
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

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.uiCamera.left = -this.camera.aspect;
        this.uiCamera.right = this.camera.aspect;
        this.uiCamera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void {
        requestAnimationFrame((t) => {
            this.render();
            this.animate();
        });
    }

    private render() {
        this.stats.update();

        const delta = this.clock.getDelta();

        this.targetInfo.update(this.camera, this.scene);
        this.crosshairBehaviour.update(this.crosshair, this.targetInfo);

        this.player.update(delta);

        this.renderer.autoClear = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.autoClear = false;
        this.renderer.render(this.uiScene, this.uiCamera);
    }

}

new App();