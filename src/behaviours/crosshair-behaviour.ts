import {Crosshair} from "../game-objects/gui";
import {Behaviour} from "./behaviour";
import {Color} from "three";
import {TargetInfo} from "../utils/target-info";

export class CrosshairBehaviour implements Behaviour<Crosshair, [TargetInfo]> {
    private colorNeutral = new Color(0xffffff);
    private colorCanAttach = new Color(0x299A20);

    update(crosshair: Crosshair, targetInfo: TargetInfo) {
        crosshair.material.color = targetInfo.canAttach ? this.colorCanAttach : this.colorNeutral;
    }
}