import {MathUtils, PerspectiveCamera, Quaternion, Spherical, Vector3} from "three";

interface State {
    mouseX: number;
    mouseY: number;
    mouseXDelta: number;
    mouseYDelta: number;

    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;

    mouseLeft: boolean;
    mouseRight: boolean;
}

export class FirstPersonControls {
    private readonly current: State;
    private previous: State | null = null;
    private _onMouseMove = this.onMouseMove.bind(this);
    private _onMouseDown = this.onMouseDown.bind(this);
    private _onMouseUp = this.onMouseUp.bind(this);
    private _onKeyDown = this.onKeyDown.bind(this);
    private _onKeyUp = this.onKeyUp.bind(this);

    private rotation_ = new Quaternion();
    private translation_ = new Vector3(0, 2, 0);

    private phi_ = 0;
    private phiSpeed_ = 8;
    private theta_ = 0;
    private thetaSpeed_ = 5;

    private _lookDirection = new Vector3();
    private _spherical = new Spherical();
    private _target = new Vector3();

    private lat = 0;
    private lon = 0;

    private camera: PerspectiveCamera;
    private domElement: HTMLCanvasElement;

    private viewHalfX = 0;
    private viewHalfY = 0;

    public movementSpeed = 1.0;
    public lookSpeed = 0.005;


    public activeLook = true;

    public verticalMax = Math.PI;

    public mouseDragOn = false;


    constructor(camera: PerspectiveCamera, domElement: HTMLCanvasElement) {
        this.current = {
            mouseXDelta: 0,
            mouseYDelta: 0,
            mouseX: 0,
            mouseY: 0,

            mouseRight: false,
            mouseLeft: false,

            moveBackward: false,
            moveRight: false,
            moveForward: false,
            moveLeft: false
        }



        this.camera = camera;
        this.domElement = domElement;

        this.domElement.addEventListener('contextmenu', FirstPersonControls.onContextMenu);
        this.domElement.addEventListener('mousemove', this._onMouseMove);
        this.domElement.addEventListener('mousedown', this._onMouseDown);
        this.domElement.addEventListener('mouseup', this._onMouseUp);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);

        this.handleResize();
        this.setOrientation();
    }

    public handleResize() {
        this.viewHalfX = this.domElement.offsetWidth / 2;
        this.viewHalfY = this.domElement.offsetHeight / 2;
    }

    private onMouseDown(event: MouseEvent) {
        this.domElement.focus();

        if (this.activeLook) {
            switch (event.button) {
                case 0:
                    this.current.mouseLeft = true;
                    break;
                case 2:
                    this.current.mouseRight = true;
                    break;

            }
        }

        this.mouseDragOn = true;
    }

    private onMouseUp(event: MouseEvent) {
        if (this.activeLook) {
            switch (event.button) {
                case 0:
                    this.current.mouseLeft = false;
                    break;
                case 2:
                    this.current.mouseRight = false;
                    break;
            }
        }

        this.mouseDragOn = false;
    }

    private onMouseMove(event: MouseEvent) {
        this.current.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
        this.current.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

        if (this.previous === null) {
            this.previous = {...this.current};
        }

        this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
        this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.current.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.current.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.current.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.current.moveRight = true;
                break;
            //
            // case 'KeyR': this.moveUp = true; break;
            // case 'KeyF': this.moveDown = true; break;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.current.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.current.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.current.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.current.moveRight = false;
                break;
            // case 'KeyR':
            //     this.moveUp = false;
            //     break;
            // case 'KeyF':
            //     this.moveDown = false;
            //     break;

        }
    }

    public lookAt(x: number, y: number, z: number) {
        this._target.set(x, y, z);
        this.camera.lookAt(this._target)
        this.setOrientation();
        return this;
    }

    public lookAtVector(vector: Vector3) {
        this._target.copy(vector);
        this.camera.lookAt(this._target)
        this.setOrientation();
        return this;
    }

    private setOrientation() {
        const quaternion = this.camera.quaternion;

        this._lookDirection.set(0, 0, -1).applyQuaternion(quaternion);
        this._spherical.setFromVector3(this._lookDirection);

        this.lat = 90 - MathUtils.radToDeg(this._spherical.phi);
        this.lon = MathUtils.radToDeg(this._spherical.theta);
    }

    public update(delta: number) {
        this.updateRotation();
        this.updateCamera();
        this.updateTranslation(delta);
        this.updateControls();
    }

    private updateControls() {
        if (this.previous !== null) {
            this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
            this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;

            this.previous = {...this.current};
        }
    }

    private updateRotation() {
        const xh = this.current.mouseXDelta / window.innerWidth;
        const yh = this.current.mouseYDelta / window.innerHeight;

        this.phi_ += -xh * this.phiSpeed_;
        this.theta_ = MathUtils.clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);

        const qx = new Quaternion();
        qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi_);
        const qz = new Quaternion();
        qz.setFromAxisAngle(new Vector3(1, 0, 0), this.theta_);

        const q = new Quaternion();
        q.multiply(qx);
        q.multiply(qz);

        this.rotation_.copy(q);
    }

    private updateCamera() {
        this.camera.quaternion.copy(this.rotation_);
        this.camera.position.copy(this.translation_);

        const forward = new Vector3(0, 0, -1);
        forward.applyQuaternion(this.rotation_);

        forward.multiplyScalar(100);
        forward.add(this.translation_);

        this.camera.lookAt(forward);
    }
    
    private updateTranslation(delta: number) {
        const forwardVelocity = (this.current.moveForward ? 1 : 0) + (this.current.moveBackward ? -1 : 0);
        const strafeVelocity = (this.current.moveLeft ? 1 : 0) + (this.current.moveRight ? -1 : 0);

        const qx = new Quaternion();
        qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi_);

        const forward = new Vector3(0, 0, -1);
        forward.applyQuaternion(qx);
        forward.multiplyScalar(forwardVelocity * delta * 10);

        const left = new Vector3(-1, 0, 0);
        left.applyQuaternion(qx);
        left.multiplyScalar(strafeVelocity * delta * 10);

        this.translation_.add(forward);
        this.translation_.add(left);
    }

    public dispose() {
        this.domElement.removeEventListener('contextmenu', FirstPersonControls.onContextMenu);
        this.domElement.removeEventListener('mousedown', this._onMouseDown);
        this.domElement.removeEventListener('mousemove', this._onMouseMove);
        this.domElement.removeEventListener('mouseup', this._onMouseUp);

        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }

    private static onContextMenu(this: HTMLCanvasElement, ev: MouseEvent) {
        ev.preventDefault();
    }
}
