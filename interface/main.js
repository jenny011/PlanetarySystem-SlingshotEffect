let params = {
  debugMode: false,
  starMass: 1000000,
  starColor: "#FFBA33",
  maxNumber: 8,
  planetMass: 100,
  planetColor: "#FFFFFF",
  voyagerColor: "#99BBFF"
};

let gui = new dat.GUI();
gui.add(params, "debugMode");
gui.add(params, "starMass",1000000,5000000).step(1000);
gui.addColor(params, "starColor");
gui.add(params, "maxNumber",0,8).step(1).listen();
gui.add(params, "planetMass",100,300).step(5);
gui.addColor(params, "planetColor");
gui.addColor(params, "voyagerColor");

let star;
let planets = [];
let voyagers = [];
const GRAVITY = 6.67;
let create = false;
let launch = false;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background(0);
  star = new Star(width/2,height/2,params.starMass,params.starColor);
}

function draw() {
  if(params.debugMode){
    background(100,100,100);
  }else{
    background(0);
  }
  let mouse = new p5.Vector(mouseX,mouseY);

//star
  star.evolve(params.starMass,params.starColor);
  star.display();

//create planets
  createPlanets(mouse);
  //planets
  orbit(mouse);
  //voyagers
  flyby(mouse);
}

function createPlanets(mouse){
  if(params.maxNumber>planets.length){
    if((mouseX>width/2-star.r*1.5&&mouseX<width/2+star.r*1.5&&mouseY<height/2+star.r*2&&mouseY>height/2-star.r*2) == false && (mouseX>width-200 && mouseY<260) == false &&mouseX>100&&mouseX<width-100 ){
      if(mouseIsPressed && create == false){
        let cleanOrbit = true;
        let r = new p5.Vector.sub(mouse,star.pos);
        for(let i=0; i<planets.length; i++){
          if(Math.abs(r.mag()-planets[i].toStar)<=params.planetMass*0.08+planets[i].r){
            cleanOrbit = false;
            if((mouseX<planets[i].pos.x+planets[i].r&&mouseX>planets[i].pos.x-planets[i].r&&mouseY<planets[i].pos.y+planets[i].r&&mouseY>planets[i].pos.y-planets[i].r)==false){
              noStroke();
              fill(255,200);
              text("Too close to neighboring planets", mouseX, mouseY);
            }
            break;
          }
        }
        if (cleanOrbit == true){
          create = true;
          planets.push(new Planet(mouseX,mouseY,params.planetMass,params.planetColor,r.mag(),random(0.002,0.02)));
          cleanOrbit = false;
        }
      }else if(mouseIsPressed == false && create == true){
        create = false;
      }
    }
  }else if(params.maxNumber<planets.length){
    planets = planets.slice(0,params.maxNumber);
  }
}

function orbit(mouse){
//planets
    for(let i=0; i<planets.length; i++){
      planet = planets[i];
      planet.applyGattraction(star);
      if(planet.vel.mag() == 0){
        planet.getV(star);
      }

      if(params.debugMode){
          line(star.pos.x,star.pos.y,planet.pos.x,planet.pos.y);
      }

      //when star.mass changes
      planet.checkOffOrbit(star);

      //launch??
      if(mouseX>planet.pos.x-planet.r&&mouseX<planet.pos.x+planet.r&&mouseY>planet.pos.y-planet.r&&mouseY<planet.pos.y+planet.r){
          planet.evolve(planet.m,color(255,50,100,180));
        if(mouseIsPressed){
          if(planet.launch == false){
            planet.launch = true;
          }
        }
      }else{
        planet.evolve(planet.m,planet.originalC);
      }

      //launch!!
      if(planet.launch == true){
        planet.evolve(planet.m,color(255,50,100,180));
        stroke(255);
        let dir = p5.Vector.sub(mouse, planet.pos);
        dir.limit(50);
        push();
        translate(planet.pos.x,planet.pos.y);
        line(0,0,dir.x,dir.y);
        pop();
        if(keyIsPressed){
          let mag = map(dir.mag(),0,50,0.6,1);
          dir.normalize();
          dir.mult(planet.r);
          planet.evolve(planet.m,planet.originalC);
          voyagers.push(new Voyager(planet.pos.x+dir.x,planet.pos.y+dir.y,0.001,params.voyagerColor,i,mag));
          planet.launch = false;
        }
      }

      //planet updates
      planet.checkRoche(star);
      if(planet.checkRoche(star) == false){
        planet.drawOrbit(star);
      }else if(planet.checkRoche(star) == true){
        planets.splice(i,1);
      }

      for(let j=0; j<planets.length; j++){
        if(planet != planets[j]){
          planet.checkCollision(planets[j]);
          if(planet.checkCollision(planets[j])==true){
            planets.splice(i,1);
            planets.splice(j,1);
            break;
          }
        }
      }

      planet.update();
      planet.display();
    }
}

function flyby(mouse){
//voyagers
    for(let i=0; i<voyagers.length; i++){
      voyager = voyagers[i];
      if(voyager.vel.mag() == 0){
        voyager.getV(mouse);
      }

      for(let j=0; j<planets.length; j++){
        // if(i != voyager.parent){
          voyager.applyGattraction(planets[j]);
          //Roche-Planet
          voyager.checkRoche(planets[j]);
          if(voyager.checkRoche(planets[j]) == true){
            voyagers.splice(i,1);
          }
        // }
      }
      voyager.applySattraction(star);
      for(let j=0; j<voyagers.length; j++){
        if(voyager != voyagers[j]){
          voyager.checkCollision(voyagers[j]);
          if(voyager.checkCollision(voyagers[j])==true){
            voyagers.splice(i,1);
            voyagers.splice(j,1);
            break;
          }
        }
      }

      //Roche-Star
      voyager.checkRoche(star);
      if(voyager.checkRoche(star) == true||voyager.pos.x>width+height/2||voyager.pos.y>height/2*3||voyager.pos.x<-height/2||voyager.pos.y<-height/2){
        voyagers.splice(i,1);
      }

      //voyagers update
      voyager.update();
      voyager.display();
    }
}
