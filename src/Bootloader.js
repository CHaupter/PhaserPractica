class Bootloader extends Phaser.Scene {
    constructor() {
        super({key:'Bootloader'}); 
    }

    init(){}

    preload() {
        this.load.setPath('./assets/');

        this.load.image("bag","bag.png")
        this.load.image("door","door.png")
        this.load.image("ground","ground.png")
        this.load.atlas("mummy", "mummy/mummy_walk.png","mummy/mummy_atlas.json")
        this.load.animation("mummyAnim", "mummy/mummy_anim.json")

        this.load.atlas("monedas", "moneda/monedas.png", "moneda/monedas_atlas.json")
        this.load.animation("moneda_json","moneda/monedas_anim.json")

        this.load.audio("theme","theme.mp3")
        this.load.audio("coin", ["Coin_1.mp3"])

        this.load.image("font", "font/font.png")
        this.load.json("fontConfig", "font/font.json")

        this.load.on("complete", ()=>{
            const fontConfig= this.cache.json.get("fontConfig");
            this.cache.bitmapFont.add("pixelFont", Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
        })

        this.centroCanvas={
            width: this.sys.game.config.width /2,
            height: this.sys.game.config.height /2,
        };
    }

    create() {
        this.tema= this.sound.play("theme")
        this.salto= false;
        this.dobleSalto= false;
        this.mummy= this.physics.add.sprite(100,315,"mummy").setScale(2).setCollideWorldBounds(true)
        this.ground_one= this.physics.add.sprite(500, 180, "ground").setScale(.2)
        this.mummy.body.setGravityY(-100)
        this.mummy.anims.play("mummy_walk")
        this.coin= this.sound.add("coin")
        
        this.data.set("puntos", 0)
        this.bolsa= this.add.image(30,310,"bag").setScale(.07).setDepth(1)
        this.puerta= this.add.image(600, 315, "door").setScale(.2).setVisible(false)
                
        this.teclas=this.input.keyboard.createCursorKeys()
        this.teclaP= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.teclaR= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        const eventos= Phaser.Input.Events;

        this.estaPausado= false;

        this.grupo= this.physics.add.group({
            key: "monedas",
            repeat: 2,
            //maxSize:4,
            setXY: {
                x: Phaser.Math.Between(100,300),
                y: 200,
                stepX: 100,
            },
            setDepth:0,
            removeCallback: ()=>{                
                this.grupo.create(30, 100, "monedas")
            }
            
        });
        

        this.grupo.children.iterate( (moneda)=> {
            
            moneda.setScale(4)
            moneda.body.setAllowGravity(false)
        })

        this.grupo.playAnimation("moneda")

        this.add.tween({
            targets: this.grupo.getChildren(),
            y: 260,
            yoyo: true,
            duration: 500,
            repeat: -1,
            ease: "Power1"
        })
        
        this.teclas.left.on("down", ()=>{
            if(!this.mummy.flipX)
                this.mummy.flipX= true;
        })

        this.teclas.right.on("down", ()=>{
            if(this.mummy.flipX)
                this.mummy.flipX= false;
        })

        this.puntos= this.data.get("puntos");
        this.texto= this.add.bitmapText(50, 50, "pixelFont", "Puntos: " + this.puntos);
        
        this.teclas.space.on("down", ()=>{
            
            if(this.mummy.y == 315){
                this.mummy.setVelocityY(-220);
                this.salto= true;
                this.dobleSalto= false;
            }

            if(this.mummy.y !=315 && this.salto && !this.dobleSalto){
                this.mummy.setVelocityY(-220);
                this.dobleSalto= true;
            }

        })

        this.teclaP.on("down", ()=>{

            if(!this.estaPausado){
                this.scene.pause()
                this.estaPausado= true;
            }

        })

        


        this.physics.add.collider(this.mummy, this.grupo)

    }

    update(){
        
        if(this.physics.world.collide(this.mummy, this.grupo)){
            this.grupo.getChildren()[0].destroy();
            this.coin.play();

            this.data.set("puntos", this.data.get("puntos") + 100);
            this.texto.setText("Puntos: " + this.data.get("puntos"))
        }

        
        if(this.data.get("puntos") == 300){
            this.texto.setVisible(false)
            this.winText= this.add.bitmapText(this.centroCanvas.width/2, this.centroCanvas.height/2, "pixelFont", "HAS GANADO");
        
            this.puerta.setVisible(true)
        
        }

        if(this.puerta.visible){
            if(this.puerta.x== this.mummy.x)
            this.scene.start("Bootloader")
        }


        if(this.teclas.right.isDown){
            this.mummy.x+=4;
            if(this.mummy.anims.isPaused){
                this.mummy.anims.resume()
            }
        }
        if(this.teclas.left.isDown){
            this.mummy.x-=4;
            if(this.mummy.anims.isPaused){
                this.mummy.anims.resume()
            }
        }
                
        if(!this.teclas.right.isDown && !this.teclas.left.isDown && !this.teclas.up.isDown && !this.teclas.down.isDown ){
            this.mummy.anims.pause()
        }

        
    }

}
export default Bootloader;