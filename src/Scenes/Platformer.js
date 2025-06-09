class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 100;
        this.DRAG = 900;  
        this.physics.world.gravity.y = 600;
        this.JUMP_VELOCITY = -200;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 4;

    }

    create() {

        this.map = this.add.tilemap("worldmap", 8, 8, 100, 32);
        this.gameActive = true;

        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap");

        this.groundLayer = this.map.createLayer("tiles", this.tileset, 0, 0);
        this.overLayer = this.map.createLayer("overlay", this.tileset, 0, 0);

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "coin1"
            //frame: 101
        });

        // initialize door objects (bottom left, bottom right, top left, top right)
        this.doorbl = this.map.createFromObjects("Objects", {name: "door_bl",key: "doorbl",});
        this.physics.world.enable(this.doorbl, Phaser.Physics.Arcade.STATIC_BODY);
        this.doorbr = this.map.createFromObjects("Objects", {name: "door_br",key: "doorbr",});
        this.physics.world.enable(this.doorbr, Phaser.Physics.Arcade.STATIC_BODY);
        this.doortl = this.map.createFromObjects("Objects", {name: "door_tl",key: "doortl",});
        this.physics.world.enable(this.doortl, Phaser.Physics.Arcade.STATIC_BODY);
        this.doortr = this.map.createFromObjects("Objects", {name: "door_tr",key: "doortr",});
        this.physics.world.enable(this.doortr, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        this.coinGroup = this.add.group(this.coins);
        this.door = this.add.group(this.doorbl, this.doorbr, this.doortl, this.doortr);

        my.sprite.player = this.physics.add.sprite(30, 145, "player");
        my.sprite.player.setScale(1.5);
        my.sprite.player.flipX = true
        my.sprite.player.setCollideWorldBounds(true, 0.3, 2.0, true);

        my.sprite.ghostPlayer = this.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.ghostPlayer.visible = false;

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.points = 0;

        my.text.score = this.add.text(my.sprite.player.x, my.sprite.player.y, "Score: " + this.points, {
            fontFamily: 'Arial',
            fontSize: 10,
            wordWrap: {
                width: 390
            }
        });
        //my.text.score.setScrollFactor(0,0);

        my.text.end1 = this.add.text(this.cameras.main.worldView.x + 58, this.cameras.main.worldView.y + 120, "Level Complete!", {
            fontFamily: 'Arial',
            fontSize: 20
        });
        my.text.end2 = this.add.text(this.cameras.main.worldView.x + 67, this.cameras.main.worldView.y + 150, "Press R to restart", {
            fontFamily: 'Arial',
            fontSize: 16
        });
        my.text.end1.visible = false;
        my.text.end2.visible = false;

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy();
            this.sound.play("getCoin", {
                volume: 1   
            });
            this.points += 1;
            this.updateScore();
        });

        this.physics.add.overlap(my.sprite.player, this.door, (obj1, obj2) => {
            if(this.gameActive){
                this.sound.play("getCoin", {
                    volume: 1   
                });
                this.gameActive = false;
                console.log("game end");
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setVelocityX(0);
                my.sprite.player.setVelocityY(0);
                my.sprite.player.anims.play('idle');

                my.text.end1.visible = true;
                my.text.end2.visible = true;

                my.text.end1.x = this.cameras.main.worldView.x + 58;
                my.text.end1.y = this.cameras.main.worldView.y + 60;
                my.text.end2.x = this.cameras.main.worldView.x + 67;
                my.text.end2.y = this.cameras.main.worldView.y + 80;
                
                my.vfx.walking.stop();
            }
        });

        this.originalY = 0;

        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        this.physics.world.drawDebug = false

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['flame_01.png', 'flame_04.png'],
            random: true,
            scale: {start: 0.01, end: 0.02},
            maxAliveParticles: 4,
            lifespan: 350,
            alpha: {start: 0.9, end: 0.3}, 
        });

        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {
            frame: ['slash_01.png', 'slash_02.png'],
            random: true,
            scale: {start: 0.03, end: 0.0008},
            maxAliveParticles: 3,
            lifespan: 250,
            alpha: {start: 0.6, end: 0.2}, 
            duration: 200,
        });

        my.vfx.walking.stop();
        my.vfx.jump.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.ghostPlayer, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {
        if(this.gameActive){
            my.text.score.x = this.cameras.main.worldView.x + 4;
            my.text.score.y = this.cameras.main.worldView.y + 4;

            if(cursors.left.isDown) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);

                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

                my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walking.start();

                }

            } else if(cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
                my.sprite.player.setFlip(false, false);
                my.sprite.player.anims.play('walk', true);
                
                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-2, false);

                my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);

                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walking.start();

                }

            } else {
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                
                my.vfx.walking.stop();
            }

            // player jump
            if(!my.sprite.player.body.blocked.down) {
                my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-6, my.sprite.player.displayHeight/2-1, false);
                my.sprite.player.anims.play('jump');
                my.sprite.ghostPlayer.x = my.sprite.player.x;
                //this.cameras.main.setFollowOffset(0,  -(this.originalY - this.cameras.main.centerY));
                //this.cameras.main.centerX = my.sprite.player.x;
            }else{
                //this.cameras.main.setFollowOffset(0, 0);
                my.sprite.ghostPlayer.x = my.sprite.player.x;
                my.sprite.ghostPlayer.y = my.sprite.player.y;
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                //this.originalY = my.sprite.player.y;
                this.sound.play("playerJump", {
                    volume: 1   
                });
                my.vfx.jump.start();
                //this.cameras.main.stopFollow();
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
                this.scene.restart();
        }
    }

    updateScore(){
        my.text.score.setText("Score: " + this.points);
    }
}