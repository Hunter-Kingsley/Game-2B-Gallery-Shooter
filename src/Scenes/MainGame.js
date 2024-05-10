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

        this.bulletSpeed = 2.5;
        this.eggSpeed = 5;
        this.bulletCooldown = 20;
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

        this.load.setPath("./assets/Shooting_Gallery/PNG/Stall/");
        this.load.image("background", "bg_blue.png");

        this.load.setPath("./assets/Shooting_Gallery/PNG/Objects/");
        this.load.image("Duck_A", "duck_yellow.png");
        this.load.image("Duck_B", "duck_white.png");

        this.load.setPath("./assets/Pixel_Mart/");
        this.load.image("Egg", "egg_white.png");

    }

    create() {
        console.log('test log');
        let my = this.my;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
            maxSize: 4,
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

    }

    update() {
        let my = this.my;
        my.random_num = Math.ceil(Math.random() * 1000);

        if ((this.counter % 1600) == 0) {
            this.send_waves(this.wave_num);
            if (this.wave_num < this.my.sprite.enemies.length) {
                this.wave_num += 2;
            }
        }

        if ((this.counter % 400) == 0) {
            console.log("reset");
            for (let i = 0; i < 8; i++) {
                this.duck_on_cooldown[i] = false;
            }
            console.log(this.duck_on_cooldown);
        }

        this.bulletCooldownCounter--;
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (this.bulletCooldownCounter < 0) {
                let bullet = my.sprite.bulletGroup.getFirstDead();
                if (bullet != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
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
                        bullet.makeInactive();
                        console.log(this.duck_health);
                    }
                }
            });

            if (this.duck_health[i] == 0) {
                duck.active = false;
                duck.visible = false;
                duck.x = -50;
                duck.y = -50;
            }

            if((duck.y > 330) && (my.random_num < 10)) {
                if (this.duck_on_cooldown[i] == false) {
                    if (this.eggCooldownCounter < 0) {
                        my.random_num = Math.ceil(Math.random() * 1000);
                        let egg = my.sprite.eggGroup.getFirstDead();
                        if (egg != null) {
                            this.duck_on_cooldown[i] = true;
                            console.log(this.duck_on_cooldown);
                            this.eggCooldownCounter = this.eggCooldown;
                            egg.makeActive();
                            egg.x = duck.x;
                            egg.y = duck.y;
                        }
                    }
                }
            }
        });

        my.sprite.eggGroup.getChildren().forEach( (egg) => {
            if (egg.y > (game.config.height - my.sprite.player.displayHeight - 50)   ) {
                if (this.collides(my.sprite.player, egg)) {
                    // Remove Player Health
                }
            }
        });

        

        my.sprite.player.update();
        this.counter++;
    }
}