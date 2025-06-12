class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("tilemap_tiles", "tilemap_packed.png");
        this.load.tilemapTiledJSON("l0map", "platformer-tilemap.tmj");
        this.load.tilemapTiledJSON("l1map", "level1-tilemap.tmj");
        this.load.tilemapTiledJSON("l2map", "level2-tilemap.tmj");

        this.load.image("player", "tile_0105.png");
        this.load.image("playerwalk", "tile_0106.png");
        this.load.image("playerjump", "tile_0107.png");
        this.load.image("coin1", "tile_0088.png");

        this.load.image("doortl", "tile_0103.png");
        this.load.image("doortr", "tile_0104.png");
        this.load.image("doorbl", "tile_0118.png");
        this.load.image("doorbr", "tile_0119.png");

        this.load.spritesheet("tilemap", "tilemap_packed.png", {
            frameWidth: 8,
            frameHeight: 8
        });

        this.load.audio("playerJump", "jump.wav");
        this.load.audio("playerLand", "land.wav");
        this.load.audio("getCoin", "coin.wav");
        this.load.audio("newLevel", "newlvl.wav");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            defaultTextureKey: "playerwalk",
            /*frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,*/
            frames: [
                {frame: "playerwalk" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "player",
            frames: [
                { frame: "player" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "playerjump",
            frames: [
                { frame: "playerjump" }
            ],
            repeat: -1
        });

        this.scene.start("startScreen", {level: 0, score: 0});
    }

    update() {
    }
}