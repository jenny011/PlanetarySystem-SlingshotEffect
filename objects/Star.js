class Star{
  constructor(x,y,mass,clr){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.acc = createVector();
    this.m = mass;
    this.dens = 0.00003;
    this.r = this.m*this.dens;
    this.c = clr;
  }
  applyForce(f){
    let force = f.copy();
    force.div(this.m);
    this.acc.add(force);
  }
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
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
    if(params.debugMode){
      stroke(255,0,0);
      strokeWeight(2);
      noFill();
      ellipse(0,0,1,1);
    }
    ellipse(0,0,this.r*2,this.r*2);
    fill(red(this.c),green(this.c),blue(this.c),60);
    ellipse(0,0,this.r*2+Math.abs(24*sin(frameCount*0.01)),this.r*2+Math.abs(24*sin(frameCount*0.01)));
    pop();
  }
}
