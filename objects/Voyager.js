class Voyager{
  constructor(x,y,mass,clr,n,mag){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();
    this.m = mass;
    this.dens = 2000;
    this.r = this.m*this.dens;
    this.c = clr;
    this.t = 60;
    this.parent = n;
    this.mag = mag;
  }
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  applyForce(f){
    let force = f.copy();
    force.div(this.m);
    this.acc.add(force);
  }
  applyGattraction(other){ //Gravity attraction
    let force = p5.Vector.sub(other.pos, this.pos);
    let distance = force.mag();
    let mag = (GRAVITY * other.m * this.m) / (distance * distance);
    force.normalize();
    force.mult(mag/100);
    this.applyForce(force);
  }
  applySattraction(other){ //Gravity attraction
    let force = p5.Vector.sub(other.pos, this.pos);
    let distance = force.mag();
    let mag = (GRAVITY * other.m * this.m) / (distance * distance);
    force.normalize();
    force.mult(mag/30000);
    this.applyForce(force);
  }
  getV(mouse){
    let parent = planets[this.parent];
    let distance = this.getDistance(parent);
    let direction = p5.Vector.sub(mouse, this.pos);
    direction.normalize();
    direction.mult(this.mag*Math.sqrt(0.5*GRAVITY*parent.m/distance)/4);
    direction.add(parent.vel);
    direction.add(this.getVrotation(parent));
    this.vel = direction;
  }
  getVrotation(parent){
    let direction = p5.Vector.sub(parent.pos,this.pos);
    direction.normalize();
    let vector = new p5.Vector(direction.y,-direction.x);
    vector.mult(parent.v);
    return vector;
  }
  getDistance(other){
    let vector = p5.Vector.sub(other.pos,this.pos);
    let distance = vector.mag();
    return distance;
  }
  checkCollision(other){
    let distance = this.getDistance(other);
    if(distance<=this.r+other.r){ //update position
      this.die();
      other.die();
      return true;
    }
    return false;
  }
  checkRoche(other){
    let distance = this.getDistance(other);
    let roche = this.r*Math.pow(2*other.m/this.m,1/3)/90;
    if(distance<=roche){
      this.die();
      return true;
    }
    return false;
  }
  die(){
    this.t -= 3.3;
    this.r += 6;
    this.c = color(red(this.c),green(this.c),blue(this.c),this.t);
    this.vel.mult(0);
    return true;
  }
  evolve(mass,clr){
    this.m = mass;
    this.r = this.m*this.dens;
    this.c = clr;
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    noStroke();
    fill(this.c);
    ellipse(0,0,this.r*2+Math.abs(4*sin(frameCount*0.05)),this.r*2+Math.abs(4*sin(frameCount*0.05)));
    pop();
  }
}
