class StartScreen extends Phaser.Scene {
    constructor() {
        super("startScreen");
    }

    init(data){
        this.score = data.score;
        this.level = data.level;
    }

    create(){
        this.map = this.add.tilemap("l0map", 8, 8, 100, 32);
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap");
        this.backgroundLayer = this.map.createLayer("overlay", this.tileset, -100, 0);
        this.backgroundLayer.setScale(3);

        my.text.start1 = this.add.text(130, 260, "Underearth Adventure", {
            fontFamily: 'Arial',
            fontSize: 80
        });
        my.text.start2 = this.add.text(200, 360, "Press the space bar to begin", {
            fontFamily: 'Arial',
            fontSize: 50
        });
        this.spaceKey = this.input.keyboard.addKey('SPACE');
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("platformerScene", {level: this.level, score : this.score});
        }
    }
}

class EndScreen extends Phaser.Scene {
    constructor() {
        super("endScreen");
    }
    
    init(data){
        this.score = data.score;
        this.level = data.level;
    }

    create(){
        this.map = this.add.tilemap("l0map", 8, 8, 100, 32);
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap");
        this.backgroundLayer = this.map.createLayer("overlay", this.tileset, -100, 0);
        this.backgroundLayer.setScale(3);

        my.text.start1 = this.add.text(340, 220, "You Win!", {
            fontFamily: 'Arial',
            fontSize: 90
        });
        my.text.start2 = this.add.text(320, 330, "Your final score: " + this.score, {
            fontFamily: 'Arial',
            fontSize: 50
        });
        my.text.start2 = this.add.text(300, 400, "Press Space to play again", {
            fontFamily: 'Arial',
            fontSize: 40
        });
        this.spaceKey = this.input.keyboard.addKey('SPACE');
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("platformerScene", {level: 0, score : 0});
        }
    }
}

class LevelFail extends Phaser.Scene {
    constructor() {
        super("levelFail");
    }
    
    init(data){
        this.score = data.score
        this.level = data.level
    }

    create(){
        this.map = this.add.tilemap("l0map", 8, 8, 100, 32);
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap");
        this.backgroundLayer = this.map.createLayer("overlay", this.tileset, -100, 0);
        this.backgroundLayer.setScale(3);

        my.text.start1 = this.add.text(280, 260, "Level Failed!", {
            fontFamily: 'Arial',
            fontSize: 90
        });
        my.text.start2 = this.add.text(250, 380, "Press Space to restart the level", {
            fontFamily: 'Arial',
            fontSize: 40
        });
        this.spaceKey = this.input.keyboard.addKey('SPACE');
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("platformerScene", {level: this.level, score : this.score});
        }
    }
}