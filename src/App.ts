import {
    BoxGeometry,
    Clock, CubeTexture,
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
    Sprite,
    SpriteMaterial,
    sRGBEncoding,
    TextureLoader,
    WebGLRenderer
} from "three";
import {FirstPersonControls} from "./controls/first-person-controls";
import Stats from "three/examples/jsm/libs/stats.module";


export class App {
    private camera!: PerspectiveCamera;
    private scene!: Scene;
    private uiCamera!: OrthographicCamera;
    private uiScene!: Scene;

    private renderer!: WebGLRenderer;

    private sprite!: Sprite;
    private clock: Clock;
    private stats: Stats;
    private container: HTMLDivElement;
    private controls: FirstPersonControls;

    constructor() {
        this.clock = new Clock();
        // @ts-ignore
        this.stats = new Stats();
        this.container = document.getElementById("app") as HTMLDivElement;

        this.initRenderer();

        this.initLights();

        this.initScene();


        // init controls
        this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
        this.controls.movementSpeed = 150;
        this.controls.lookSpeed = 0.1;

        this.onWindowResize();

        this.animate();
    }

    private initScene() {
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

        const mapLoader = new TextureLoader();
        const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
        const checkerboard = mapLoader.load('images/textures/checkerboard.png');
        checkerboard.anisotropy = maxAnisotropy;
        checkerboard.wrapS = RepeatWrapping;
        checkerboard.wrapT = RepeatWrapping;
        checkerboard.repeat.set(32, 32);
        checkerboard.encoding = sRGBEncoding;

        const plane = new Mesh(
            new PlaneGeometry(100, 100, 10, 10),
            new MeshStandardMaterial({map: checkerboard}));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);

        const box = new Mesh(
            new BoxGeometry(4, 4, 4),
            this.loadMaterial('vintage-tile1_', 0.2)
        );
        box.position.set(10, 2, 0);
        box.castShadow = true;
        box.receiveShadow = true;
        this.scene.add(box);

        const concreteMaterial = this.loadMaterial('concrete3-', 4);

        const wall1 = new Mesh(
            new BoxGeometry(100, 100, 4),
            concreteMaterial);
        wall1.position.set(0, -40, -50);
        wall1.castShadow = true;
        wall1.receiveShadow = true;
        this.scene.add(wall1);

        const wall2 = new Mesh(
            new BoxGeometry(100, 100, 4),
            concreteMaterial);
        wall2.position.set(0, -40, 50);
        wall2.castShadow = true;
        wall2.receiveShadow = true;
        this.scene.add(wall2);

        const wall3 = new Mesh(
            new BoxGeometry(4, 100, 100),
            concreteMaterial);
        wall3.position.set(50, -40, 0);
        wall3.castShadow = true;
        wall3.receiveShadow = true;
        this.scene.add(wall3);

        const wall4 = new Mesh(
            new BoxGeometry(4, 100, 100),
            concreteMaterial);
        wall4.position.set(-50, -40, 0);
        wall4.castShadow = true;
        wall4.receiveShadow = true;
        this.scene.add(wall4);

        // Crosshair
        const crosshair = mapLoader.load('images/textures/crosshair.png');
        crosshair.anisotropy = maxAnisotropy;

        this.sprite = new Sprite(
            new SpriteMaterial({map: crosshair, color: 0xffffff, fog: false, depthTest: false, depthWrite: false}));
        this.sprite.scale.set(0.15, 0.15 * this.camera.aspect, 1)
        this.sprite.position.set(0, 0, -10);

        this.uiScene.add(this.sprite);
    }

    private initLights() {
        const distance = 50.0;
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

        spotLight.position.set(25, 25, 0);
        spotLight.lookAt(0, 0, 0);
        this.scene.add(spotLight);

        const upColour = 0xFFFF80;
        const downColour = 0x808080;
        const hemiLight = new HemisphereLight(upColour, downColour, 0.5);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 4, 0);
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
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 2, 0);

        this.scene = new Scene();

        this.uiCamera = new OrthographicCamera(-1, 1, aspect, -1 * aspect, 1, 1000);
        this.uiScene = new Scene();
    }

    loadMaterial(name: string, tiling: number) {
        const mapLoader = new TextureLoader();
        const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

        const metalMap = mapLoader.load('resources/freepbr/' + name + 'metallic.png');
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

        this.controls.handleResize();
    }

    private animate(): void {
        requestAnimationFrame((t) => {
            this.render();
            this.animate();
        });
    }

    private render() {
        this.stats.update();

        this.controls.update(this.clock.getDelta());
        this.renderer.autoClear = true;
        this.renderer.render(this.scene, this.camera);
        this.renderer.autoClear = false;
        this.renderer.render(this.uiScene, this.uiCamera);
    }
}

new App();