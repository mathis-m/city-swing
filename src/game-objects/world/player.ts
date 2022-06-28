import {
    Box3,
    Euler,
    MathUtils,
    Matrix3,
    Object3D,
    PerspectiveCamera,
    Quaternion,
    Raycaster,
    Renderer,
    Scene,
    Vector3
} from "three";
import {Rope} from "./rope";
import {WorldObjectData, WorldObjectTags} from "./world-object-data";
import {TargetInfo} from "../../utils/target-info";
import {soundManager} from "../../sound-manager/sound-manager";

interface KeyState {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;

    mouseLeft: boolean;
    mouseRight: boolean;

    jump: boolean;
}


export class Player {
    private keyState: KeyState = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,

        mouseLeft: false,
        mouseRight: false,

        jump: false,
    };

    private raycaster = new Raycaster();
    private camera: PerspectiveCamera;
    private cameraDirection: Vector3;
    private velocity: Vector3;
    private nextVelocity: Vector3;
    private nextPosition: Vector3;
    private down: Vector3;
    private gravity: number;
    private height: number;
    private mouseSensitivity: number;
    private walkSpeed: number;
    private airwalkSpeed: number;
    private jumpStrength: number;
    private grounded: boolean;
    private onRope: boolean;
    private ropeLength: number;
    private ropeTarget: Vector3;
    private positionOnEndOfRope: Vector3;
    private ropePositionDifference: Vector3;
    private ropeObject: Rope;
    private mouseDragOn: boolean = false;

    private phi = 0;
    private phiSpeed_ = 8;
    private theta = 0;
    private thetaSpeed_ = 5;

    private viewHalfX = 0;
    private viewHalfY = 0;


    private _onMouseDown = this.onMouseDown.bind(this);
    private _onMouseUp = this.onMouseUp.bind(this);
    private _onKeyDown = this.onKeyDown.bind(this);
    onMouseMove = this._onMouseMove.bind(this);
    private _onKeyUp = this.onKeyUp.bind(this);
    private scene: Scene;
    private renderer: Renderer;
    private targetInfo: TargetInfo;

    private initialPosition: Vector3;
    private initialRotation: Euler;
    private initialQuaternion: Quaternion;

    private counterDiv: HTMLDivElement;
    private points = 0;


    constructor(camera: PerspectiveCamera, scene: Scene, renderer: Renderer, targetInfo: TargetInfo) {
        const elementById = document.getElementById("counter");
        if (!elementById) throw new Error("Counter not found");
        this.counterDiv = elementById as HTMLDivElement;

        this.counterDiv.innerText = `${this.points}`;

        this.initialPosition = camera.position.clone();
        this.initialRotation = camera.rotation.clone();
        this.initialQuaternion = camera.quaternion.clone();
        this.camera = camera;
        this.scene = scene;
        this.targetInfo = targetInfo;
        this.cameraDirection = new Vector3();
        this.camera.rotation.order = "YXZ";

        this.velocity = new Vector3();
        this.nextVelocity = new Vector3();
        this.nextPosition = new Vector3();
        this.down = new Vector3(0, -1, 0);
        this.gravity = 28;

        this.height = 100;
        this.mouseSensitivity = 0.0012;

        this.walkSpeed = 5;
        this.airwalkSpeed = 0.3;
        this.jumpStrength = 16;

        this.grounded = false;
        this.onRope = false;

        this.ropeLength = 0;

        this.ropeTarget = new Vector3();
        this.positionOnEndOfRope = new Vector3();
        this.ropePositionDifference = new Vector3();

        this.ropeObject = new Rope(scene);


        renderer.domElement.addEventListener('mousedown', this._onMouseDown);
        renderer.domElement.addEventListener('mouseup', this._onMouseUp);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        this.renderer = renderer;
        this.handleResize();
    }

    public reset() {
        this.counterDiv.innerText = `0`;
        this.points = 0;

        this.scene.children.forEach(block => {
            if (!block.userData) return;
            const userData = block.userData as WorldObjectData;
            if (!userData.tags || !userData.tags.includes(WorldObjectTags.Platform)) return;
            userData.isCollected = false;
        })

        this.camera.position.copy(this.initialPosition);
        this.camera.rotation.copy(this.initialRotation);
        this.camera.quaternion.copy(this.initialQuaternion);

        this.velocity.multiplyScalar(0);

        this.grounded = false;
        this.onRope = false;

        this.phi = 0;
        this.theta = 0;
        this.keyState = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,

            mouseLeft: false,
            mouseRight: false,

            jump: false,
        };
    }

    public handleResize() {
        this.viewHalfX = this.renderer.domElement.offsetWidth / 2;
        this.viewHalfY = this.renderer.domElement.offsetHeight / 2;
    }


    private onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keyState.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keyState.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keyState.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keyState.moveRight = true;
                break;
            case 'Space':
                this.keyState.jump = true;
                break;
            case 'KeyR':
                this.reset();
                break;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.keyState.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.keyState.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keyState.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keyState.moveRight = false;
                break;
            case 'Space':
                this.keyState.jump = false;
                break;
        }
    }

    private onMouseDown(event: MouseEvent) {
        switch (event.button) {
            case 0:
                this.keyState.mouseLeft = true;

                if (this.onRope) break;

                this.camera.getWorldDirection(this.cameraDirection);


                if (!this.targetInfo.canAttach) break;

                soundManager.playGrab();

                this.ropeTarget.copy(this.targetInfo.target);
                this.ropeLength = this.targetInfo.targetDistance;
                this.onRope = true;
                this.ropeObject.set(this.position, this.ropeLength);

                break;
            case 2:
                this.keyState.mouseRight = true;
                break;

        }
        this.mouseDragOn = true;
    }

    private onMouseUp(event: MouseEvent) {
        switch (event.button) {
            case 0:
                this.keyState.mouseLeft = false;

                this.onRope = false;
                this.ropeObject.hide();
                soundManager.playGrabRelease();

                break;
            case 2:
                this.keyState.mouseRight = false;
                break;
        }

        this.mouseDragOn = false;
    }

    get position() {
        return this.camera.position;
    }

    update(delta: number) {
        //subtract gravity!
        this.velocity.y -= this.gravity * delta;

        //swing on rope
        if (this.onRope) this.swing();

        //walk/airwalk
        this.move(delta);

        //check if fallen
        this.checkOnBoundaries();

        //update the IK rope
        if (this.onRope) this.updateRope();
    }

    updateRope() {
        //update the rope object
        if (this.onRope) {

            let ropePos = this.position.clone();
            ropePos.y -= 5;

            this.ropeObject.update(ropePos, this.ropeTarget.clone());
        }
    }

    swing() {
        //calculate swing
        if (this.ropeTarget.distanceToSquared(this.position) > this.ropeLength * this.ropeLength) {

            //calculate coordinate where ball is supposed to be (on end of rope)
            this.positionOnEndOfRope.subVectors(this.position, this.ropeTarget);
            this.positionOnEndOfRope.setLength(this.ropeLength);
            this.positionOnEndOfRope.add(this.ropeTarget);

            //the difference of current position to the positions on the end of the rope.
            this.ropePositionDifference.subVectors(this.position, this.positionOnEndOfRope);


            //remove bouncyness from rope..
            let d = Math.abs(
                this.positionOnEndOfRope.clone()
                    .normalize()
                    .dot(this.ropePositionDifference.clone().normalize())
            );
            this.ropePositionDifference.multiplyScalar(1 - (d * 0.3));

            //move ball to end of the rope and add to velocity
            this.velocity.sub(this.ropePositionDifference);

            this.position.copy(this.positionOnEndOfRope);
        }
    }

    move(delta: number) {
        //acceleration vector3 by user input
        let keyInput = this.getKeyInput();

        //add acceleration to velocity and velocity to postition.
        this.nextVelocity.copy(this.velocity).add(keyInput);
        this.nextPosition.copy(this.position).add(this.nextVelocity);

        //check if new position collides with raycasting ( and bounces from surface )
        this.raycastNextPosition();

        //copy actual position and velocity
        this.position.copy(this.nextPosition);
        this.velocity.copy(this.nextVelocity);

        //apply 'air resistance / ground friction'
        if (!this.onRope && this.grounded) {
            this.velocity.x *= 0.8;
            this.velocity.y *= 0.99;
            this.velocity.z *= 0.8;

        } else {

            this.velocity.x *= 0.9995;
            this.velocity.y *= 0.9995;
            this.velocity.z *= 0.9995;
        }

        //jump
        if (this.keyState.jump && this.grounded) {

            this.grounded = false;
            this.velocity.y = this.jumpStrength;

        }

        //actually move player
        this.position.add(this.velocity.clone().multiplyScalar(delta));

    }

    _onMouseMove(event: MouseEvent) {
        const xh = event.movementX / window.innerWidth;
        const yh = event.movementY / window.innerHeight;

        this.phi += -xh * this.phiSpeed_;
        this.theta = MathUtils.clamp(this.theta + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);

        const qx = new Quaternion();
        qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi);
        const qz = new Quaternion();
        qz.setFromAxisAngle(new Vector3(1, 0, 0), this.theta);

        const q = new Quaternion();
        q.multiply(qx);
        q.multiply(qz);
        this.camera.quaternion.copy(q);
    }

    rotateInput(input: Vector3) {
        //rotated to players y-axis rotation
        let playerRotation = new Euler(0, this.camera.rotation.y, 0, 'YXZ');
        return input.normalize().applyEuler(playerRotation);
    }


    getKeyInput() {
        let keyInput = this.getKeyBoardInput();
        if (this.grounded) {
            if (this.onRope) {
                keyInput.multiplyScalar(this.walkSpeed * 0.2);
            } else {
                keyInput.multiplyScalar(this.walkSpeed);
            }
        } else {
            keyInput.multiplyScalar(this.airwalkSpeed);
        }
        return keyInput;
    }

    getKeyBoardInput() {

        let d = new Vector3();

        //x axis (left/right)
        if (this.keyState.moveForward) {

            d.z -= 1;

        } else if (this.keyState.moveBackward) {

            d.z += 1;

        }

        //z axis (front-back)
        if (this.keyState.moveLeft) {
            d.x -= 1;
        } else if (this.keyState.moveRight) {
            d.x += 1;
        }

        return this.rotateInput(d);
    }

    raycastNextPosition() {

        let groundedOnBlocks = false;

        //raycast game.blocks
        this.scene.children.forEach(block => {

            if (!block.userData) return;
            const tags = (block.userData as WorldObjectData).tags;
            if (!tags || !tags.includes(WorldObjectTags.Collision)) return;

            //broad phase
            let bbDist = new Box3().setFromObject(block).distanceToPoint(this.nextPosition);

            if (bbDist < 100) {

                //narrow phase ( raycast )
                //first check down, to enable walking on surfaces. Otherwise check velocity direction

                //colliding downwards, otherwise in the velocity's direction
                let intersectDown = this.collide(block, this.nextPosition, this.down);

                if (intersectDown && intersectDown.distance < this.height) {

                    //reflect velocity
                    this.nextVelocity.y *= -0.25;

                    //set position from surface
                    this.nextPosition.copy(intersectDown.point);
                    this.nextPosition.add(this.scene.up.clone().multiplyScalar(this.height + 0.2));

                    //set grounded flag
                    groundedOnBlocks = true;
                    if (!(block.userData as WorldObjectData).isCollected && tags && tags.includes(WorldObjectTags.Platform)) {
                        this.points++;
                        soundManager.playGroundHit();
                        (block.userData as WorldObjectData).isCollected = true;
                        this.counterDiv.innerText = `${this.points}`;
                    }
                } else {

                    //colliding in the direction of the velocity
                    let intersectDirection = this.collide(block, this.nextPosition, this.nextVelocity.clone().normalize());

                    if (intersectDirection && intersectDirection.distance < this.height) {

                        //bounce velocity
                        const direction = new Vector3().subVectors(intersectDirection.point, this.nextPosition).normalize();

                        //calculate normal
                        const normal = intersectDirection.face?.normal;
                        if (normal) {
                            const normalMatrix = new Matrix3().getNormalMatrix(intersectDirection.object.matrixWorld);
                            normal.applyMatrix3(normalMatrix).normalize();

                            this.nextVelocity.reflect(normal).multiplyScalar(0.4);
                        }

                        //set position from surface
                        this.nextPosition.copy(intersectDirection.point);
                        this.nextPosition.add(direction.multiplyScalar(-(this.height + 0.2)));

                        //set grounded flag
                        groundedOnBlocks = true;
                        if (!(block.userData as WorldObjectData).isCollected && tags && tags.includes(WorldObjectTags.Platform)) {
                            this.points++;
                            (block.userData as WorldObjectData).isCollected = true;
                            this.counterDiv.innerText = `${this.points}`;
                        }
                    }

                }

            }

        });

        //set grounded flag
        this.grounded = groundedOnBlocks;
    }

    collide(object: Object3D, point: Vector3, direction: Vector3) {
        if (!object) return;
        this.raycaster.set(point, direction);
        let intersects = this.raycaster.intersectObject(object, true);

        if (intersects.length > 0) return intersects[0];

        return undefined;
    }

    collideBlocks(point: Vector3, direction: Vector3) {
        this.raycaster.set(point, direction);
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) return intersects[0];

        return undefined;
    }

    checkOnBoundaries() {
        if (this.position.y < -8000 && !this.onRope) {
            soundManager.playGameOver();
            this.reset();
        }
    }
}