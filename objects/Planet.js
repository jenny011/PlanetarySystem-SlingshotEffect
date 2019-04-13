class Planet{
  constructor(x,y,mass,clr,toStar,w){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();
    this.m = mass;
    this.dens = 0.08;
    this.r = this.m*this.dens;
    this.t = 60;
    this.c = clr;
    this.originalC = clr;
    this.toStar = toStar;
    this.launch = false;
    this.w = w;
    this.v = this.w*this.r;
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
    let mag = (GRAVITY * this.m * other.m) / (distance * distance);
    force.normalize();
    force.mult(mag/250000);
    this.applyForce(force);
  }
  getV(other){
    let direction = p5.Vector.sub(other.pos, this.pos);
    let distance = direction.mag();
    let v = createVector(direction.y,-direction.x);
    v.normalize();
    let mag = Math.sqrt(GRAVITY*other.m/distance);
    v.mult(mag/500);
    this.vel = v;
  }
  getDistance(other){
    let vector = p5.Vector.sub(other.pos,this.pos);
    let distance = vector.mag();
    return distance;
  }
  checkOffOrbit(other){
    let distance = this.getDistance(other);
    if(distance < this.toStar-1 || distance > this.toStar+1){
      this.toStar = distance;
      return true;
    }
    return false;
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
    let roche = this.r*Math.pow(2*other.m/this.m,1/3)/3.8;
    if(distance<=roche){
      this.die();
      return true;
    }
    return false;
  }
  die(){
    this.t -= 2;
    this.r += 20;
    this.c = color(red(this.c),green(this.c),blue(this.c),this.t);
    this.vel.mult(0);
  }
  evolve(mass,clr){
    this.m = mass;
    this.r = this.m*this.dens;
    this.c = clr;
  }
  drawOrbit(other){
    noFill();
    stroke(255,100);
    let direction = p5.Vector.sub(other.pos,this.pos);
    let r = direction.mag();
    ellipse(other.pos.x,other.pos.y,2*r,2*r);
  }
  display(){
    push();
    translate(this.pos.x,this.pos.y);
    rotate(frameCount*this.w);
    noStroke();
    fill(this.c);
    if(params.debugMode){
      stroke(255,0,0);
      strokeWeight(2);
      noFill();
      ellipse(0,0,1,1);
      stroke(0);
      line(0,0,this.r,this.r);
    }
    ellipse(0,0,this.r*2,this.r*2);
    pop();
  }
}
