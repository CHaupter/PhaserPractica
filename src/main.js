import Bootloader from './Bootloader.js';

const config = {
    title: "PhaserPractica",
    version: "0.0.1",
    type: Phaser.AUTO,
    scale: {
        parent: "phaser_container",
        width: 640,
        height: 360,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: "#4834d4",
    pixelArt: true,
    physics: {
        default: "arcade",
        "arcade": {
            gravity: {
                y: 500
            },
            debug: true
        }
    },
    scene: [
        Bootloader
    ]
};

new Phaser.Game(config);