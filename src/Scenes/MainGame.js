class MainGame extends Phaser.Scene {
    constructor() {
        super('mainScene');

        this.my = {sprite:{}, text:{}};
        this.my.sprite.background = [];
    }

    preload() {
        this.load.setPath("./assets/Alien_UFO/PNG/");
        this.load.image("Player", "shipYellow_manned.png");

        this.load.setPath("./assets/Shooting_Gallery/PNG/Stall/");
        this.load.image("background", "bg_blue.png");
    }

    create() {
        console.log('test log');
        let my = this.my;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");

        // my.sprite.background = this.add.image(0, 0, "background");
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 3; j++) {
                my.sprite.background.push(this.add.image((i*256), (j*256), "background"));
            }
        }
        //bruh moment

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 45, "Player", null, this.left, this.right, 2);
        my.sprite.player.setScale(0.60);

    }

    update() {
        let my = this.my;

        my.sprite.player.update();
    }
}