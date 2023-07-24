class BallImpl {
    constructor(x, y, radius) {
        this.color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
        this.direction = Math.random() * Math.PI * 2;
        this.radius = radius;
        this.speed = Math.random() * 3 + 1;
        this.x = x;
        this.y = y;
    }
    updatePosition(width, height) {
        const sugar = sugarBall;
        const hive = hiveBall;
        const takers = antsTakers;
        if (this === hive)
            return;
        if (this !== sugar) {
            if (!found || takers.includes(this)) {
                const mathhypot = Math.hypot(this.x - sugar.x, this.y - sugar.y);
                if (mathhypot < dist && mathhypot !== 0) {
                    this.direction = Math.atan2(sugar.y - this.y, sugar.x - this.x);
                }
                if (Math.hypot(this.x - sugar.x, this.y - sugar.y) < 30) {
                    this.speed = 0;
                }
                else if (sugar.speed > 0) {
                    this.speed = backSpeed;
                }
            }
        }
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * -1);
        }
        else if (this.x + this.radius > width) {
            this.x = width - this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * -1);
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));
        }
        else if (this.y + this.radius > height) {
            this.y = height - this.radius;
            this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));
        }
    }
}
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const balls = [];
const antsTakers = [];
let sugarX = 0;
let sugarY = 0;
let numberOfAntsNeeded;
let backSpeed = Math.random() * 3 + 1;
let antsAroundSugar = 0;
let found = false;
let dist = 100;
const hiveBall = new BallImpl(Math.random() * canvas.width, Math.random() * canvas.height, 50);
hiveBall.speed = 0;
balls.push(hiveBall);
const sugarBall = new BallImpl(sugarX, sugarY, 30);
sugarBall.speed = 0;
balls.push(sugarBall);
function loop() {
    window.requestAnimationFrame(loop);
    let height = canvas.height;
    let width = canvas.width;
    antsAroundSugar = 0;
    for (let index = 0; index < balls.length; index++) {
        let ball = balls[index];
        context.fillStyle = ball.color;
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fill();
        ball.updatePosition(width, height);
        if (Math.hypot(ball.x - sugarBall.x, ball.y - sugarBall.y) < 30) {
            if (ball !== sugarBall && ball !== hiveBall) {
                antsAroundSugar++;
                dist = 300;
                if (antsTakers.length !== numberOfAntsNeeded) {
                    if (!antsTakers.includes(ball))
                        antsTakers.push(ball);
                }
            }
        }
        if (antsAroundSugar === numberOfAntsNeeded) {
            found = true;
            sugarBall.direction = Math.atan2(hiveBall.y - sugarBall.y, hiveBall.x - sugarBall.x);
            sugarBall.speed = backSpeed;
        }
    }
    context.fillStyle = "black";
    context.font = "30px Arial";
    let amount = numberOfAntsNeeded - antsAroundSugar;
    if (amount < 0)
        amount = 0;
    context.fillText(amount.toString(), sugarBall.x - 10, sugarBall.y + 5);
}
document.getElementById("canvas").style.display = "none";
function updateNumberOfAnts() {
    const numAntsInput = document.getElementById("numAnts");
    numberOfAntsNeeded = parseInt(numAntsInput.value);
    numberOfAntsNeeded = Math.max(4, numberOfAntsNeeded);
}
function start() {
    updateNumberOfAnts(); // Call the function to update the number of ants
    document.getElementById("canvas").style.display = "block";
    const fieldSizeInput = document.getElementById("fieldSize");
    const numAntsInput = document.getElementById("numAnts");
    const fieldSize = parseInt(fieldSizeInput.value);
    const numberOfAnts = parseInt(numAntsInput.value);
    antsTakers.length = 0;
    balls.length = 0;
    sugarX = Math.floor(Math.random() * fieldSize + 20);
    sugarY = Math.floor(Math.random() * fieldSize + 20);
    found = false;
    dist = 100;
    hiveBall.x = Math.random() * fieldSize;
    hiveBall.y = Math.random() * fieldSize;
    while (Math.abs(hiveBall.x - sugarX) < 200 || Math.abs(hiveBall.y - sugarY) < 200) {
        sugarX = Math.floor(Math.random() * fieldSize + 20);
        sugarY = Math.floor(Math.random() * fieldSize + 20);
    }
    sugarBall.x = sugarX;
    sugarBall.y = sugarY;
    numberOfAntsNeeded = Math.max(4, Math.min(numberOfAnts, numberOfAnts - 1));
    for (let index = 0; index < numberOfAnts; index++) {
        balls.push(new BallImpl(hiveBall.x, hiveBall.y, 10));
    }
    loop();
}
