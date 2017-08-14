class Moving {
  
  constructor(x=0,y=0,w=0,h=0,vx=0,vy=0){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = vx;
    this.vy = vy;
  }
  draw(context){
    context.fillStyle = "#fff";
    context.fillRect(this.x,this.y,this.w,this.h);
  }
  move(){
    this.x += this.vx;
    this.y += this.vy;
  }
  get left(){
    return this.x;
  }
  get right(){
    return this.x+this.w;
  }
  get top(){
    return this.y;
  }
  get bottom(){
    return this.y+this.h;
  }
  
}

class Ball extends Moving{
  
  constructor(x=95,y=95,w=10,h=10,vx=0,vy=0){
    super(x,y,w,h,vx,vy);
  }
  
}

class Player extends Moving{
  
  constructor(x=0,y=0,w=0,h=0,vx=0,vy=0,score = 0){
    super(x,y,w,h,vx,vy);
    this.score = score;
  }
  
}

class Score{
  
  constructor(){
    this.num = [
      '111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '101101111001001',
      '111100111001111',
      '111100111101111',
      '111001001001001',
      '111101111101111',
      '111101111001111',
    ];
  }
  draw(context,canvas,playerOne,playerTwo){
    let align = canvas.width / 3 - 15/2; 
    let numImages = this.numImage;
    let playerOneScore = playerOne.score.toString().split("");
    let playerTwoScore = playerTwo.score.toString().split("");
    playerOneScore.forEach((v,i) => {
      context.drawImage(numImages[v],align/2 + i*15,20);
    });
    playerTwoScore.forEach((v,i) => {
      context.drawImage(numImages[v],align*1.5 + i*15,20);
    });
    
  } 
  get numImage(){
    const CHAR_PIXEL = 5;
    let cImages = this.num.map(str => {
                 let canvas = document.createElement("canvas");
                 canvas.width = CHAR_PIXEL * 3;
                 canvas.height = CHAR_PIXEL * 5;
                 let context = canvas.getContext("2d");
                 let strArr = str.split("");
                 let length = strArr.length;
                 for(let i=0; i<length; i++){
                   if(strArr[i] === "1"){
                     let col = i%3*CHAR_PIXEL;
                     let row = i/3*CHAR_PIXEL;
                     context.fillStyle = "#fff";
                     context.fillRect(col,row,CHAR_PIXEL,CHAR_PIXEL);
                   }
                 }
                return canvas;
               }
  )
  return cImages;
  }
  
}

class Pong{
  
  constructor(canvas){
    this.canvas = canvas;
    this.ball = new Ball();
    this.ball.vx = 1;
    this.ball.vy = 1;
    this.playerOne = new Player(0,50,10,100,0,0);
    this.playerTwo = new Player(190,50,10,100,0,0);
    this.score = new Score();
    this.stopFlag = false;
    this.animation = (millis) => {
      this.update();
    };
    requestAnimationFrame(this.animation);
  }
  draw(){
    let context = this.canvas.getContext("2d");
    context.fillStyle= "#000";
    context.fillRect(0,0,200,200);
    this.ball.draw(context);
    this.playerOne.draw(context);
    this.playerTwo.draw(context);
    this.score.draw(context,this.canvas,this.playerOne,this.playerTwo);
    
  }
  collide(){
    if(this.playerOne.left < this.ball.right && 
       this.playerOne.right > this.ball.left &&
       this.playerOne.top < this.ball.bottom && 
       this.playerOne.bottom > this.ball.top){
        this.ball.vx = -this.ball.vx+1*Math.random();
        this.ball.vy = -this.ball.vy+1*Math.random();
    }
    if(this.playerTwo.left < this.ball.right && 
       this.playerTwo.right > this.ball.left &&
       this.playerTwo.top < this.ball.bottom && 
       this.playerTwo.bottom > this.ball.top){
        this.ball.vx = -this.ball.vx;
        this.ball.vy = -this.ball.vy;
    }
    if(this.ball.vy < 0 && this.ball.top < 0 
       || this.ball.vy >0 && this.ball.bottom > this.canvas.height){
      this.ball.vy = -this.ball.vy;
    }
    if(this.ball.left < 0){
      this.playerTwo.score++;
      this.stop()
    }
  }
  stop(){
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.x = 95;
    this.ball.y = 95;
    this.playerOne.y = 50;
    this.playerTwo.y = 50;
    this.stopFlag = true;
  }
  start(){
    this.ball.vx = 1;
    this.ball.vy = 1;
    this.stopFlag = false;
    this.update();
  }
  automatePlayerTwo(){
    this.playerTwo.y = this.ball.y;
  }
  update(){
    if(!this.stopFlag){
      this.ball.move();
      this.automatePlayerTwo();
      this.collide();
      this.draw();
      console.log(this.ball.x);
      console.log(this.ball.vx);
      requestAnimationFrame(this.animation);
    }
  }
  
}

let canvas = document.querySelector('#pong');
const pongGame = new Pong(canvas);
canvas.addEventListener("mousemove",event => 
                        {
                           pongGame.playerOne.y = event.offsetY;
                        });
canvas.addEventListener("click",event=>
                        {
                          pongGame.start();
                        });

