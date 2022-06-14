import {Crosshair} from "../game-objects/gui";
import {Behaviour} from "./behaviour";
import {Color, PerspectiveCamera, Raycaster, Scene, Vector3} from "three";
import {WorldObjectData, WorldObjectTags} from "../game-objects/world";

export class CrosshairBehaviour implements Behaviour<Crosshair, [PerspectiveCamera, Scene]> {
    private colorNeutral = new Color(0xffffff);
    private colorCanAttach = new Color(0x299A20);

    update(crosshair: Crosshair, camera: PerspectiveCamera, scene: Scene) {
        let targetsAttachable = false;

        const rayCaster = new Raycaster()
        rayCaster.setFromCamera(new Vector3(), camera);
        for (const sceneElement of scene.children) {
            const metaData: WorldObjectData = sceneElement.userData;
            const canAttachToObject = metaData.tags && metaData.tags.includes(WorldObjectTags.Attachable);

            if (!canAttachToObject) continue;

            const intersections = rayCaster.intersectObject(sceneElement);
            if (intersections.length > 0) {
                targetsAttachable = true;
                break;
            }
        }

        crosshair.material.color = targetsAttachable ? this.colorCanAttach : this.colorNeutral;
    }
}