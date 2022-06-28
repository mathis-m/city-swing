import {Audio, AudioListener, AudioLoader, PerspectiveCamera} from "three";

class SoundManager {
    private loader = new AudioLoader();
    private loadingSuccess = false;

    private listener!: AudioListener;
    private ambientSound?: Audio;
    private groundHit?: Audio;
    private gameOver?: Audio;
    private grab?: Audio;
    private grabRelease?: Audio;

    async init(camera: PerspectiveCamera) {
        this.listener = new AudioListener();
        camera.add(this.listener);
        try {
            this.ambientSound = await this.initBuffer("sounds/ambience.ogg")
            this.ambientSound.setLoop(true);
            this.ambientSound.setVolume(0.5);

            this.groundHit = await this.initBuffer("sounds/ground-hit.ogg")
            this.groundHit.setVolume(0.5);

            this.gameOver = await this.initBuffer("sounds/game-over.ogg")
            this.gameOver.setVolume(0.5);

            this.grab = await this.initBuffer("sounds/grab.ogg")
            this.grab.setVolume(0.5);
            this.grabRelease = await this.initBuffer("sounds/grab-release.ogg")
            this.grabRelease.setVolume(0.5);

            this.loadingSuccess = true;
        } catch (e) {
            console.error(e);
            this.loadingSuccess = false;
        }
    }

    toggleAmbient() {
        if(!this.ambientSound) return;

        if(this.ambientSound.isPlaying)
            this.ambientSound.stop();
        else this.ambientSound.play();
    }

    playGroundHit() {
        if(!this.groundHit) return;

        if(this.groundHit.isPlaying) return;

        this.groundHit.play();
    }

    playGameOver() {
        if(!this.gameOver) return;

        if(this.gameOver.isPlaying) return;

        this.gameOver.play();
    }

    playGrab() {
        if(!this.grab) return;

        if(this.grab.isPlaying)
            this.grab.stop();
        this.grab.play();
    }

    playGrabRelease() {
        if(!this.grabRelease) return;

        if(this.grabRelease.isPlaying)
            this.grabRelease.stop();
        this.grabRelease.play();
    }

    async initBuffer(url: string) {
        const buffer = await new Promise<AudioBuffer>(((resolve, reject) => {
            this.loader.load(url,
                (buffer) => resolve(buffer),
                undefined,
                (err) => reject(err));
        }))

        const audio = new Audio(this.listener)
        audio.setBuffer(buffer)
        return audio;
    }
}

export const soundManager = new SoundManager();