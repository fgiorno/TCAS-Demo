
let planeA, planeB;
let state = "normal";
let alertDistance = 200;
let raDistance = 80;

// Sonidos
let trafficAlertSound, climbSound, descendSound, clearSound;
let playedRA = false;
let playedClear = false;

function preload() {
  trafficAlertSound = loadSound("traffic.mp3");
  climbSound = loadSound("climb.mp3");
  descendSound = loadSound("descend.mp3");
  clearSound = loadSound("clear.mp3");
}

function setup() {
  createCanvas(800, 400);
  let controls = createDiv().style('text-align', 'center').style('margin', '20px');

  createElement('h2', 'Panel de Control TCAS').parent(controls).style('color', 'white');

  createButton('🔊 Traffic Alert')
    .mousePressed(() => trafficAlertSound.play())
    .parent(controls)
    .style('margin', '5px');

  createButton('⬆️ Climb')
    .mousePressed(() => climbSound.play())
    .parent(controls)
    .style('margin', '5px');

  createButton('⬇️ Descend')
    .mousePressed(() => descendSound.play())
    .parent(controls)
    .style('margin', '5px');

  createButton('✅ Clear of Conflict')
    .mousePressed(() => clearSound.play())
    .parent(controls)
    .style('margin', '5px');

  planeA = { x: 100, y: 150, vx: 2, vy: 0 };
  planeB = { x: 700, y: 250, vx: -2, vy: 0 };
  textFont('monospace');
}

function draw() {
  background(20, 30, 40);
  fill(255);
  textSize(16);
  text("TCAS DEMO + Control Manual", 10, 20);

  let distance = dist(planeA.x, planeA.y, planeB.x, planeB.y);

  if (distance < raDistance && state !== "evasive") {
    if (state !== "RA") {
      climbSound.play();
      descendSound.play();
    }
    state = "RA";
  } else if (distance < alertDistance && state === "normal") {
    trafficAlertSound.play();
    state = "TA";
  }

  if (state === "RA") {
    state = "evasive";
    planeA.vy = -1.2;
    planeB.vy = 1.2;
  }

  planeA.x += planeA.vx;
  planeA.y += planeA.vy;
  planeB.x += planeB.vx;
  planeB.y += planeB.vy;

  if (state === "evasive" && distance > alertDistance && !playedClear) {
    clearSound.play();
    playedClear = true;
  }

  drawPlane(planeA.x, planeA.y, "A");
  drawPlane(planeB.x, planeB.y, "B");

  if (state === "TA" || state === "RA" || state === "evasive") {
    stroke(255, 150, 0, 150);
    noFill();
    ellipse(planeA.x, planeA.y, alertDistance * 2);
    ellipse(planeB.x, planeB.y, alertDistance * 2);
  }

  if (state === "RA" || state === "evasive") {
    stroke(255, 0, 0, 150);
    noFill();
    ellipse(planeA.x, planeA.y, raDistance * 2);
    ellipse(planeB.x, planeB.y, raDistance * 2);
  }

  fill(255);
  textSize(18);
  if (state === "TA") {
    text("TRAFFIC ALERT!", width / 2 - 80, 30);
  } else if (state === "RA") {
    text("RESOLUTION ADVISORY!", width / 2 - 110, 30);
  } else if (state === "evasive") {
    text("MANEUVERING TO AVOID CONFLICT", width / 2 - 150, 30);
  }
}

function drawPlane(x, y, label) {
  push();
  fill(100, 200, 255);
  noStroke();
  ellipse(x, y, 20, 10);
  fill(255);
  textSize(12);
  textAlign(CENTER);
  text(label, x, y - 10);
  pop();
}
