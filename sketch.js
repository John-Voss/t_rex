//variáveis globais
var t_rex,t_rex_correndo, t_rex_collide;
var bordas;
var solo, solo_anima, solo_invis;
var sorteio;
var nuven, nuven_image;
var cacto, cacto_image1, cacto_image2, cacto_image3, cacto_image4, cacto_image5, cacto_image6;
var pontuacao = 0;
var grupoCacto;
var grupoNuvens;
var JOGAR, ENCERRAR, etapaJogo;
var restaurar, restaurar_image, gameOver, gameOver_image;
var som1, som2, som3;
var recorde;

function preload(){
  t_rex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  t_rex_collide = loadAnimation('trex_collided.png');
  
  solo_anima = loadImage("ground2.png");
  
  nuven_image = loadImage('cloud.png');
  
  cacto_image1 = loadImage('obstacle1.png');
  cacto_image2 = loadImage('obstacle2.png');
  cacto_image3 = loadImage('obstacle3.png');
  cacto_image4 = loadImage('obstacle4.png');
  cacto_image5 = loadImage('obstacle5.png');
  cacto_image6 = loadImage('obstacle6.png');
  
  restaurar_image = loadImage('restart.png');
  gameOver_image = loadImage('gameOver.png');
  
  som1 = loadSound('die.mp3');
  som2 = loadSound('jump.mp3');
  som3 = loadSound('checkPoint.mp3');
}

function setup(){
  createCanvas(600,200);
  
  //criar um sprite do trex
  t_rex = createSprite(60,155,20,50);
  t_rex.addAnimation("correndo",t_rex_correndo);
  t_rex.addAnimation('collide', t_rex_collide);
  
  //criando o solo
  bordas = createEdgeSprites();
  solo = createSprite(200,175,600,20);
  solo.addImage("solo", solo_anima);
  solo_invis = createSprite(200, 190, 600, 10);
  solo_invis.visible = false;
  
  grupoCacto = new Group();
  grupoNuvens = new Group();
  JOGAR = 1;
  ENCERRAR = 0;
  etapaJogo = JOGAR;
  t_rex.setCollider('circle', 0, 0, 40);
  //t_rex.setCollider('rectangle', 0, 0, 400, 100, 0);
  //t_rex.debug = true;
  
  restaurar = createSprite(300, 100, 50, 50);
  restaurar.addImage('restart', restaurar_image);
  
  gameOver = createSprite(300, 50, 50, 50);
  gameOver.addImage('gameOver', gameOver_image);
  
  restaurar.visible = false;
  gameOver.visible = false;
  
  gameOver.scale = 0.5;
  restaurar.scale = 0.5;
  
  recorde = 0;
  
  //variaveis locais
  //var teste = 19;
  //console.log(teste);
}

function draw(){
  background("white");
  
  if(t_rex.isTouching(grupoCacto)) {
    etapaJogo = ENCERRAR;
    t_rex.changeAnimation('collide', t_rex_collide);
    //t_rex.velocityY = -10;
    //som2.play();
    //som1.play();
  }
  
  if(etapaJogo === JOGAR) {
    //salto trex
    if(keyDown("space") && t_rex.y > 150) {
      t_rex.velocityY = -10;
      som2.play();
    }
    //deslocamento do solo
    solo.velocityX = -(2 + pontuacao/100);
    
    //reinicio do solo
    if(solo.x < 0){
      solo.x = solo.width/2;
    }
    pontuacao = pontuacao+ (Math.round(frameRate()/60));
    
    if(pontuacao%100 === 0 && pontuacao > 0) {
      som3.play();
    }
    nuvens();
    cactos();
  }
  else if(etapaJogo === ENCERRAR) {
    if(recorde < pontuacao) {
    recorde = pontuacao;
  }
    stop();
    
    if(mousePressedOver(restaurar) && etapaJogo === ENCERRAR) {
    restaurar.visible = false;
    gameOver.visible = false;
    etapaJogo = JOGAR;
    t_rex.changeAnimation("correndo",t_rex_correndo);
    grupoCacto.destroyEach();
    grupoNuvens.destroyEach();
  }
  }
  //gravidade
  t_rex.velocityY += 0.5;
  
  //colisão com o solo
  t_rex.collide(solo_invis);
  
  //tamanho da animação
  t_rex.scale = 0.5;
  
  //potuaçao
  text('Pontuação: '+pontuacao, 500, 20);
  text('Recorde: ' +recorde, 500, 50);
  
  drawSprites();
  
}
function nuvens() {
  if(frameCount%60 === 0) {
    nuven = createSprite(600, 100, 20, 20);
    nuven.velocityX = - (3 + pontuacao/100);
    nuven.addImage('nuven_image', nuven_image);
    nuven.y = Math.round(random(20, 100));
    nuven.scale = random(0.5, 1);
    nuven.depth = t_rex.depth- 1;
    nuven.lifetime = 210;
    grupoNuvens.add(nuven);
     }
}
function  cactos() {
if(frameCount%200 === 0) {
  cacto = createSprite(600, 155, 30, 30);
  cacto.velocityX = - (2 + pontuacao/100)
  //cacto.scale = random(0.3, 0.5);
  cacto.lifetime = 310;
  sorteio = Math.round(random(1,6));
  switch(sorteio){
    case 1: cacto.addImage ('image1', cacto_image1);
      cacto.scale = 0.8;
    break;
    case 2: cacto.addImage ('image2', cacto_image2);
      cacto.scale = 0.6;
    break;
    case 3: cacto.addImage ('image3', cacto_image3);
      cacto.scale = 0.7;
    break;
    case 4: cacto.addImage ('image4', cacto_image4);
      cacto.scale = 0.5;
    break;
    case 5: cacto.addImage ('image5', cacto_image5);
      cacto.scale = 0.6;
    break;
    case 6: cacto.addImage ('image6', cacto_image6);
      cacto.scale = 0.5;
    break;
  }
  grupoCacto.add(cacto);
}
}
function stop() {
  grupoCacto.setVelocityXEach(0);
  grupoNuvens.setVelocityXEach(0);
  solo.velocityX = 0;
  pontuacao = 0;
  grupoCacto.setLifetimeEach(-1);
  grupoNuvens.setLifetimeEach(-1);
  restaurar.visible = true;
  gameOver.visible = true;
}

