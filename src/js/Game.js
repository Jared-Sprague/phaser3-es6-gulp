/*
global Phaser
*/

import DemoScene from 'scenes/DemoScene';

class Game extends Phaser.Game {

    constructor() {
        super({
            type   : Phaser.AUTO,
            width  : 800,
            height : 800,
            physics: {
                default: 'arcade',
                arcade : {
                    gravity: { y: 200 },
                },
            },
            scene: [DemoScene],
        });
    }
}

new Game();
