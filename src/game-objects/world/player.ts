import {
    BackSide, Box3, Euler, Matrix3,
    Mesh,
    MeshLambertMaterial, Object3D,
    PerspectiveCamera, Raycaster, Renderer, Scene,
    SphereBufferGeometry, SphereGeometry,
    TextureLoader,
    Vector3
} from "three";
import {Rope} from "./rope";
import {TargetInfo} from "../../utils";
import {WorldObjectData, WorldObjectTags} from "./world-object-data";


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
    private skybox: Mesh<SphereGeometry, MeshLambertMaterial>;
    private velocity: Vector3;
    private nextVelocity: Vector3;
    private nextPosition: Vector3;
    private down: Vector3;
    private gravity: number;
    private points: number;
    private height: number;
    private mouseSensitivity: number;
    private walkSpeed: number;
    private airwalkSpeed: number;
    private jumpStrength: number;
    private grounded: boolean;
    private onRope: boolean;
    private ropeLength: number;
    private ropeClimbSpeed: number;
    private ropeTarget: Vector3;
    private positionOnEndOfRope: Vector3;
    private ropePositionDifference: Vector3;
    private ropeObject: Rope;
    private mouseDragOn: boolean = false;

    private _onMouseDown = this.onMouseDown.bind(this);
    private _onMouseUp = this.onMouseUp.bind(this);
    private _onKeyDown = this.onKeyDown.bind(this);
    private _onMouseMove = this.onMouseMove.bind(this);
    private _onKeyUp = this.onKeyUp.bind(this);
    private _pointerlockCallback = this.pointerlockCallback.bind(this);
    private scene: Scene;
    private renderer: Renderer;
    private targetInfo: TargetInfo;

    constructor(camera: PerspectiveCamera, scene: Scene, renderer: Renderer, targetInfo: TargetInfo) {
        this.camera = camera;
        this.scene = scene;
        this.targetInfo = targetInfo;
        this.cameraDirection = new Vector3();
        this.camera.rotation.order = "YXZ";

        this.skybox = new Mesh(
            new SphereBufferGeometry(90000, 32, 32),
            new MeshLambertMaterial({
                map: new TextureLoader().load('/images/sky.png'),
                side: BackSide
            })
        );
        //scene.add(this.skybox);

        this.velocity = new Vector3();
        this.nextVelocity = new Vector3();
        this.nextPosition = new Vector3();
        this.down = new Vector3(0, -1, 0);
        this.gravity = 28;

        this.points = 0;
        this.height = 100;
        this.mouseSensitivity = 0.0012;

        this.walkSpeed = 2;
        this.airwalkSpeed = 0.25;
        this.jumpStrength = 13;

        this.grounded = false;
        this.onRope = false;

        this.ropeLength = 0;
        this.ropeClimbSpeed = 275;

        this.ropeTarget = new Vector3();
        this.positionOnEndOfRope = new Vector3();
        this.ropePositionDifference = new Vector3();

        this.ropeObject = new Rope(scene);

        document.addEventListener('pointerlockchange', this._pointerlockCallback, false);
        // renderer.domElement.addEventListener('mousemove', this._onMouseMove);
        window.onfocus = function () {
            renderer.domElement.requestPointerLock();
        };

        renderer.domElement.addEventListener('mousedown', this._onMouseDown);
        renderer.domElement.addEventListener('mouseup', this._onMouseUp);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        this.renderer = renderer;
    }


    private pointerlockCallback() {
        debugger;
        // check if pointerlock is activated, or not.
        if (document.pointerLockElement === this.renderer.domElement) {
            // add mouse move event
            document.addEventListener("mousemove", this._onMouseMove, false);
        } else {
            // remove mouse move event
            document.removeEventListener("mousemove", this._onMouseMove, false);
        }
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

        //move skybox
        this.skybox.position.copy(this.position);
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

    onMouseMove(e: MouseEvent) {

        this.camera.rotateY(e.movementX * -this.mouseSensitivity);
        this.camera.rotateX(e.movementY * -this.mouseSensitivity);

        let half_pi = Math.PI * 0.5;
        this.camera.rotation.x = Math.max(-half_pi + 0.15, Math.min(this.camera.rotation.x, half_pi - 0.15));

        this.camera.rotation.z = 0;

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
        if (this.position.y < -1600 && !this.onRope) {
            //game.reset();
        }
    }
}