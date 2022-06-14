import {Scene, Sprite, SpriteMaterial, TextureLoader, WebGLRenderer} from "three";

export class Crosshair extends Sprite {
    constructor(renderer: WebGLRenderer, guiScene: Scene, cameraAspect: number) {
        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

        const mapLoader = new TextureLoader();

        const crosshair = mapLoader.load('images/textures/crosshair.png');
        crosshair.anisotropy = maxAnisotropy;

        super(new SpriteMaterial({map: crosshair, color: 0xffffff, fog: false, depthTest: false, depthWrite: false}));

        this.scale.set(0.15, 0.15 * cameraAspect, 1)
        this.position.set(0, 0, -10);
        guiScene.add(this);
    }
}