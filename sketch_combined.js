let planeA, planeB;
let state = "normal";
let alertDistance = 200;
let raDistance = 80;

// 🎧 Archivos de sonido
let trafficAlertSound, resolutionAlertSound;

function preload() {
  // Cargar los archivos MP3
  trafficAlertSound = loadSound("traffic.mp3");
  resolutionAlertSound = loadSound("Climb.mp3");
}

function setup() {
  createCanvas(800, 400);
  planeA = { x: 100, y: 200, vx: 0.5};
  planeB = { x: 700, y: 250, vx: -0.5};
  textFont('monospace');
}

function draw() {
  background(50, 255, 255); //fondo del canva
  fill("blue");
  textSize(20);
  text("TCAS DEMO", 10, 20);
  
  //Calculo de la distancia entre las aeronaves A y B
  let distance = dist(planeA.x, planeA.y, planeB.x, planeB.y);

  // Estado lógico del TCAS
  if (distance < raDistance && state !== "evasive") {
    if (state !== "RA") {
      resolutionAlertSound.play(); // 🛑 Play solo una vez
    }
    state = "RA";
  } else if (distance < alertDistance && state === "normal") {
    trafficAlertSound.play(); // ⚠️ Play solo una vez
    state = "TA";
  }

  // Evasión
  if (state === "RA") {
    state = "evasive";
    planeA.vy = -0.75;
    planeB.vy = 0.75;
  }

  // Actualización de posición
  planeA.x += planeA.vx;
  planeB.x += planeB.vx;
  if (state === "evasive") {
    planeA.y += planeA.vy;
    planeB.y += planeB.vy;
  }

  // Dibujar aviones y zonas
  drawPlane(planeA.x, planeA.y, "A");
  drawPlane(planeB.x, planeB.y, "B");

  if (state === "TA" || state === "RA" || state === "evasive") {
    stroke(255, 255, 50);
//    stroke(255, 150, 0, 150);
    strokeWeight(4);
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

  // Mensajes TCAS
  fill("blue");
  textSize(18);
  textAlign(LEFT);
  strokeWeight(1);
  if (state === "TA") {
    //text("TRAFFIC ALERT!", width / 2 - 80, 30);
    fill("yelow");
    text("TRAFFIC ALERT!", 10, 50);
  } else if (state === "RA") {
    fill("red");
    text("RESOLUTION ADVISORY!", 10, 50);
  } else if (state === "evasive") {
    fill("red");
    text("MANIOBRA PARA EVITAR EL CONFLICTO", 10,50);
  } else {
    //fill("red");
    text("                                 ", 10,50);
  }
}

function drawPlane(x, y, label) {
  push();
  fill(100, 200, 255);
  //noStroke();
  ellipse(x, y, 20, 10);
  fill("blue");
  textSize(12);
  textAlign(CENTER);
  text(label, x, y - 10);
  pop();
}
