class Egg extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        return this;
    }

    update() {
        if (this.active) {
            this.y += this.speed;
            if (this.y > game.config.height) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.x = -50;
        this.y = -50;
        this.visible = false;
        this.active = false;
    }

}