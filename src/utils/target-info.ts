import {PerspectiveCamera, Raycaster, Scene, Vector3} from "three";
import {WorldObjectData, WorldObjectTags} from "../game-objects/world";

export class TargetInfo {
    public canAttach: boolean = false;
    public isAttached: boolean = false;

    public target = new Vector3();
    public targetDistance = 0;

    update(camera: PerspectiveCamera, scene: Scene) {
        if(this.isAttached)
            return;

        let targetIsAttachable = false;
        const rayCaster = new Raycaster()
        rayCaster.setFromCamera(new Vector3(), camera);
        for (const sceneElement of scene.children) {
            const metaData: WorldObjectData = sceneElement.userData;
            const canAttachToObject = metaData.tags && metaData.tags.includes(WorldObjectTags.Attachable);

            if (!canAttachToObject) continue;

            const intersections = rayCaster.intersectObject(sceneElement);
            if (intersections.length > 0) {
                this.target.copy(intersections[0].point)
                this.targetDistance = camera.position.distanceTo(this.target);

                targetIsAttachable = true;
                break;
            }
        }

        this.canAttach = targetIsAttachable;
    }
}