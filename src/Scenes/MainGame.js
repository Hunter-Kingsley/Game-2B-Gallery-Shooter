class MainGame extends Phaser.Scene {
    constructor() {
        super('mainScene');

        this.my = {sprite:{}, text:{}};
        this.my.sprite.background = [];
        this.my.sprite.enemies = [];

        this.enemy_path_A = [
            266, 360,
            701, 355,
            700, 471,
            253, 485,
            245, 580,
            687, 580
        ];
        this.enemy_path_B = [
            810, 331,
            813, 554,
            637, 559,
            622, 345,
            426, 336,
            431, 564,
            213, 564,
            240, 339,
        ];

        this.player_health = 3;
        this.player_score = 0;

        this.bulletSpeed = 6;
        this.eggSpeed = 4;
        this.bulletCooldown = 10;
        this.eggCooldown = 10;
        this.bulletCooldownCounter = 0;
        this.eggCooldownCounter = 0;

        this.counter = 0;
        this.wave_num = 1;
        this.random_num = 0;
        this.alive_enemies = 8;
        this.duck_on_cooldown = [];
        this.duck_health = [];
        for (let i = 0; i < 8; i++) {
            this.duck_on_cooldown.push(false);
            this.duck_health.push(5);
        }

    }

    init_game() {
        this.player_health = 3;
        this.player_score = 0;

        this.bulletSpeed = 6;
        this.eggSpeed = 4;
        this.bulletCooldown = 10;
        this.eggCooldown = 10;
        this.bulletCooldownCounter = 0;
        this.eggCooldownCounter = 0;

        this.counter = 0;
        this.wave_num = 1;
        this.random_num = 0;
        this.alive_enemies = 8;
        this.duck_on_cooldown = [];
        this.duck_health = [];
        for (let i = 0; i < 8; i++) {
            this.duck_on_cooldown.push(false);
            this.duck_health.push(5);
        }
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score: " + this.player_score);
    }

    updateHealth() {
        let my = this.my;
        my.text.health.setText("HP: " + this.player_health);
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    new_enemy(start_x, start_y, is_enemy_A) {
        if (is_enemy_A == true) {
            this.enemy_path_A.push(start_x, start_y);
            this.enemy_path_A.unshift(start_x, start_y);
            this.my.sprite.enemies.unshift(this.add.follower(new Phaser.Curves.Spline(this.enemy_path_A), start_x, start_y, "Duck_A"));
            this.enemy_path_A.pop();
            this.enemy_path_A.pop();
            this.enemy_path_A.shift();
            this.enemy_path_A.shift();
        } else {
            this.enemy_path_B.push(start_x, start_y);
            this.enemy_path_B.unshift(start_x, start_y);
            this.my.sprite.enemies.unshift(this.add.follower(new Phaser.Curves.Spline(this.enemy_path_B), start_x, start_y, "Duck_B"));
            this.enemy_path_B.pop();
            this.enemy_path_B.pop();
            this.enemy_path_B.shift();
            this.enemy_path_B.shift();
        }
    }

    send_waves(i) {
        let index = i;
        for (let duck of this.my.sprite.enemies) {
            if (index < 0) {
                break;
            }
            
            let argumetns = {
                from: 0,
                to: 1,
                duration: 7000,
                ease: 'Phaser.Math.Easing.Cubic.Out',
                delay: (index * 250)
            }
            duck.startFollow(argumetns);
            
            index--;
        }
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("Bullet", "items-foodicons-bread.png");

        this.load.setPath("./assets/Alien_UFO/PNG/");
        this.load.image("Player", "shipYellow_manned.png");

        this.load.setPath("./assets/Shooting_Gallery/PNG/Objects/");
        this.load.image("Duck_A", "duck_yellow.png");
        this.load.image("Duck_B", "duck_white.png");

        this.load.setPath("./assets/Pixel_Mart/");
        this.load.image("Egg", "egg_white.png");

        this.load.setPath("./assets/Digital_Audio/Audio/");
        this.load.audio("lose_health", "phaserDown1.wav");
        this.load.audio("quack", "quack_5.mp3");
        this.load.audio("throw", "whoosh.mp3");
        this.load.audio("eat", "phaserUp4.wav");
        this.load.audio("win", "powerUp3.wav");
        this.load.audio("egg_drop", "phaserDown2.wav");
    }

    create() {
        console.log('test log');
        let my = this.my;

        this.init_game();

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 4; j++) {
                my.sprite.background.push(this.add.image((i*256), (j*256), "background"));
            }
        }

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 55, "Player", null, this.left, this.right, 5);
        my.sprite.player.setScale(0.70);

        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "Bullet",
            maxSize: 2,
            runChildUpdate: true
            }
        )

        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });

        my.sprite.bulletGroup.getChildren().forEach((bullet) => {
            bullet.makeInactive();
        });

        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);

        my.sprite.eggGroup = this.add.group({
            active: true,
            defaultKey: "Egg",
            maxSize: 14,
            runChildUpdate: true
            }
        )

        my.sprite.eggGroup.createMultiple({
            classType: Egg,
            active: false,
            key: my.sprite.eggGroup.defaultKey,
            repeat: my.sprite.eggGroup.maxSize-1
        });

        my.sprite.eggGroup.getChildren().forEach((egg) => {
            egg.makeInactive();
        });

        my.sprite.eggGroup.propertyValueSet("speed", this.eggSpeed);
        my.sprite.eggGroup.propertyValueSet("scale", 1.3);

        this.new_enemy(450, 80, true);
        this.new_enemy(540, 80, false);
        this.new_enemy(400, 160, false);
        this.new_enemy(590, 160, false);
        this.new_enemy(350, 240, false);
        this.new_enemy(640, 240, true);
        this.new_enemy(300, 320, true);
        this.new_enemy(690, 320, true);

        for (let duck of my.sprite.enemies) {
            duck.setScale(0.7);
        }

        my.text.score = this.add.bitmapText(25, 30, "Minecraft", "Score: " + this.player_score);
        my.text.score.setFontSize(40);
        my.text.score.setBlendMode(Phaser.BlendModes.ADD);
        my.text.health = this.add.bitmapText(25, 60, "Minecraft", "HP: " + this.player_health);
        my.text.health.setFontSize(40);
        my.text.health.setBlendMode(Phaser.BlendModes.ADD);
    }

    update() {
        let my = this.my;
        my.random_num = Math.ceil(Math.random() * 1000);

        if (this.player_health > 0 && this.alive_enemies > 0) {
            if ((this.counter % 600) == 0) {
                this.send_waves(this.wave_num);
                if (this.wave_num < this.my.sprite.enemies.length) {
                    this.wave_num += 2;
                }
            }

            if ((this.counter % 200) == 0) {
                console.log("reset");
                for (let i = 0; i < 8; i++) {
                    this.duck_on_cooldown[i] = false;
                }
                console.log(this.duck_on_cooldown);
            }
        }
        

        this.bulletCooldownCounter--;
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (this.bulletCooldownCounter < 0) {
                let bullet = my.sprite.bulletGroup.getFirstDead();
                if (bullet != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    this.sound.play("throw");
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                }
            }
        }

        this.eggCooldownCounter--;
        my.sprite.enemies.forEach( (duck, i) => {
            my.sprite.bulletGroup.getChildren().forEach( (bullet) => {
                if (bullet.active) {
                    if (this.collides(bullet, duck)) {
                        this.duck_health[i]--;
                        this.sound.play("eat");
                        bullet.makeInactive();
                        console.log(this.duck_health);
                    }
                }
            });

            if (this.duck_health[i] == 0) {
                this.duck_health[i]--;
                this.sound.play("quack");
                duck.x = -50;
                duck.y = -50;
                duck.active = false;
                duck.visible = false;
                this.player_score += (10 * this.player_health);
                this.updateScore();
                console.log(this.player_score);
                this.alive_enemies--;
            }

            if((duck.y > 330) && (my.random_num < 30)) {
                if (this.duck_on_cooldown[i] == false) {
                    if (this.eggCooldownCounter < 0) {
                        my.random_num = Math.ceil(Math.random() * 1000);
                        let egg = my.sprite.eggGroup.getFirstDead();
                        if (egg != null) {
                            this.duck_on_cooldown[i] = true;
                            console.log(this.duck_on_cooldown);
                            this.eggCooldownCounter = this.eggCooldown;
                            egg.makeActive();
                            this.sound.play("egg_drop");
                            egg.x = duck.x;
                            egg.y = duck.y + 15;
                        }
                    }
                }
            }
        });

        my.sprite.eggGroup.getChildren().forEach( (egg) => {
            if (egg.y > (game.config.height - my.sprite.player.displayHeight - 50)   ) {
                if (this.collides(my.sprite.player, egg)) {
                    egg.makeInactive();
                    this.sound.play("lose_health");
                    egg.x = -50;
                    egg.y = -50;
                    this.player_health--;
                    this.updateHealth();
                }
            }
        });

        if (this.player_health == 0) {
            this.player_health--;
            my.sprite.player.killPlayer();
            my.text.gameover1 = this.add.bitmapText(345, 500, "Minecraft", "You Lose!");
            my.text.gameover1.setFontSize(80);
            my.text.gameover1.setBlendMode(Phaser.BlendModes.ADD);
            my.text.gameover2 = this.add.bitmapText(285, 570, "Minecraft", "Press [ENTER] to exit");
            my.text.gameover2.setFontSize(50);
            my.text.gameover2.setBlendMode(Phaser.BlendModes.ADD);
        }

        if (this.alive_enemies == 0) {
            this.alive_enemies--;
            this.sound.play("win");
            my.text.gamewin = this.add.bitmapText(355, 300, "Minecraft", "You Win!");
            my.text.gamewin.setFontSize(80);
            my.text.gamewin.setBlendMode(Phaser.BlendModes.ADD);
            my.text.gameover2 = this.add.bitmapText(285, 370, "Minecraft", "Press [ENTER] to exit");
            my.text.gameover2.setFontSize(50);
            my.text.gameover2.setBlendMode(Phaser.BlendModes.ADD);
        }

        if ((this.player_health <= 0 && Phaser.Input.Keyboard.JustDown(this.enter)) || (this.alive_enemies <= 0 && Phaser.Input.Keyboard.JustDown(this.enter))) {
            this.scene.start("startScene");
        }

        my.sprite.player.update();
        if (this.player_health > 0 && this.alive_enemies > 0) {
            this.counter++;
        }
        
    }
}