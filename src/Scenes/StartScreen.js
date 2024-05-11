class StartScreen extends Phaser.Scene {
    constructor() {
        super('startScene');
        this.my = {sprite:{}, text:{}};
        this.my.sprite.background = [];
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("Minecraft", "Minecraft_0.png", "Minecraft.fnt");

        this.load.setPath("./assets/Shooting_Gallery/PNG/Stall/");
        this.load.image("background", "bg_blue.png");
    }

    create() {
        let my = this.my;

        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 4; j++) {
                my.sprite.background.push(this.add.image((i*256), (j*256), "background"));
            }
        }

        my.text.Title1 = this.add.bitmapText(175, 200, "Minecraft", "Duck Feeding \n  Adventure");
        my.text.Title1.setFontSize(120);
        my.text.Title1.setBlendMode(Phaser.BlendModes.ADD);
        my.text.Title2 = this.add.bitmapText(200, 500, "Minecraft", "Press [ENTER] to start!");
        my.text.Title2.setFontSize(60);
        my.text.Title2.setBlendMode(Phaser.BlendModes.ADD);

        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enter)) {
            this.scene.start("mainScene");
        }
    }
}