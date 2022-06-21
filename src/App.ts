import {
    Clock,
    CubeTextureLoader,
    HemisphereLight,
    MathUtils,
    MeshStandardMaterial,
    OrthographicCamera,
    PCFSoftShadowMap,
    PerspectiveCamera,
    RepeatWrapping,
    Scene,
    SpotLight,
    sRGBEncoding,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import {Crosshair} from "./game-objects/gui";
import {CrosshairBehaviour} from "./behaviours";
import {LevelGenerator} from "./levels/levelGenerator";
import {Sky} from "three/examples/jsm/objects/Sky";
import {TargetInfo} from "./utils/target-info";
import {Player} from "./game-objects/world/player";


export class App {
    private _pointerlockCallback = this.pointerlockCallback.bind(this);

    private camera!: PerspectiveCamera;
    private scene!: Scene;
    private uiCamera!: OrthographicCamera;
    private uiScene!: Scene;

    private renderer!: WebGLRenderer;

    private crosshair!: Crosshair;
    private crosshairBehaviour: CrosshairBehaviour = new CrosshairBehaviour();

    private clock!: Clock;
    private stats!: Stats;
    private container!: HTMLDivElement;

    private targetInfo: TargetInfo = new TargetInfo();

    private player!: Player;
    private sky!: Sky;
    private sun!: Vector3;
    private levelGen!: LevelGenerator;

    constructor() {
        // this.setupGame();
        const startBtn = document.getElementById("start-normal");

        startBtn?.addEventListener("click", this.startNormal.bind(this));
    }


    private pointerlockCallback() {
        // check if pointerlock is activated, or not.
        if (document.pointerLockElement === this.renderer.domElement) {
            // add mouse move event
            document.addEventListener("mousemove", this.player.onMouseMove, false);
        } else {
            // remove mouse move event
            document.removeEventListener("mousemove", this.player.onMouseMove, false);
        }
    }

    private startNormal() {
        const menuDiv = document.getElementById("main");
        if (menuDiv)
            menuDiv.style.display = "none";

        const pointsDiv = document.getElementById("points");
        if (pointsDiv)
            pointsDiv.style.display = "flex";


        this.clock = new Clock();
        // @ts-ignore
        this.stats = new Stats();
        this.container = document.getElementById("app") as HTMLDivElement;


        this.initRenderer();
        this.initSky();

        this.initLights();

        this.initScene();


        this.player = new Player(this.camera, this.scene, this.renderer, this.targetInfo);

        // init controls
        // this.controls = new FirstPersonControls(this.camera, this.renderer.domElement, this.targetInfo, this.rope);
        // this.controls.movementSpeed = 150;
        // this.controls.lookSpeed = 0.1;

        this.onWindowResize();

        document.addEventListener('pointerlockchange', this._pointerlockCallback, false);
        window.onfocus = () => {
            this.renderer.domElement.requestPointerLock();
        };
        this.renderer.domElement.requestPointerLock();


        this.animate();
    }

    private setupGame() {

    }

    private initScene() {

        this.crosshair = new Crosshair(this.renderer, this.uiScene, this.camera.aspect);


        this.levelGen = new LevelGenerator();
        this.levelGen.init(this.scene, this.renderer);
        let spawnLocation = this.levelGen.getSpawnLocation();
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
        const far = 100000.0;
        // this.camera = new PerspectiveCamera(
        //     65,
        //     window.innerWidth / window.innerHeight,
        //     0.01,
        //     100000
        // );
        //
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
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

        this.levelGen.update(this.scene, this.renderer);

        this.renderer.autoClear = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.autoClear = false;
        this.renderer.render(this.uiScene, this.uiCamera);
    }

    private initSky() {
        // Add Sky
        this.sky = new Sky();
        this.sky.scale.setScalar(45000000);
        this.scene.add(this.sky);

        this.sun = new Vector3();

        const uniforms = this.sky.material.uniforms;
        uniforms['turbidity'].value = 10;
        uniforms['rayleigh'].value = 3;
        uniforms['mieCoefficient'].value = 0.005;
        uniforms['mieDirectionalG'].value = 0.7;

        const phi = MathUtils.degToRad(88);
        const theta = MathUtils.degToRad(180);

        this.sun.setFromSphericalCoords(1, phi, theta);

        uniforms['sunPosition'].value.copy(this.sun);
    }
}

new App();