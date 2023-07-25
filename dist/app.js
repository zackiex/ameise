class BallImpl {
    // Constructor
    constructor(x, y, radius) {
        // Generate a random color for the ball.
        this.color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
        // Generate a random direction for the ball (in radians).
        this.direction = Math.random() * Math.PI * 2;
        this.radius = radius;
        // Generate a random speed for the ball.
        this.speed = Math.random() * 3 + 1;
        this.x = x;
        this.y = y;
    }
    updatePosition(width, height) {
        // Get the sugar ball and hive ball references
        const sugar = sugarBall;
        const hive = hiveBall;
        // Get the list of ants that are currently going to the sugar ball
        const takers = antsTakers;
        // If this ball is the hive ball, return as hive ball doesn't move
        if (this === hive)
            return;
        if (this !== sugar) {
            // Check If the sugar has not been found or this ball is one of the ants
            if (!found || takers.includes(this)) {
                // distance between ball and the sugar
                const mathhypot = Math.hypot(this.x - sugar.x, this.y - sugar.y);
                // If the distance is less than a threshold then change the direction to sugar
                if (mathhypot < dist && mathhypot !== 0) {
                    this.direction = Math.atan2(sugar.y - this.y, sugar.x - this.x);
                }
                // If distance is very close to the sugar ball = stop movement
                if (Math.hypot(this.x - sugar.x, this.y - sugar.y) < 30) {
                    this.speed = 0;
                }
                // If the sugar ball is moving (the ant is returning)
                else if (sugar.speed > 0) {
                    this.speed = backSpeed;
                }
            }
        }
        // Move the ball based on its current direction and speed.
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        // Check if the ball is out of the canvas boundaries and adjust its position accordingly
        // and change directions (opposite direction )
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
// Initialize arrays to hold balls and ant takers
const balls = [];
const antsTakers = [];
let x = document.documentElement.clientWidth;
let y = document.documentElement.clientHeight;
// Randomly generate initial positions for the sugar and hive balls.
let sugarX = Math.floor(Math.random() * x + 20);
let sugarY = Math.floor(Math.random() * y + 20);
// Set initial values for other variables.
let numberOfAntsNeeded = 5; // i will change iit later
let backSpeed = Math.random() * 3 + 1;
let antsAroundSugar = 0;
let found = false;
let dist = 100;
// Create a hive ball and add it to the balls array.
const hiveBall = new BallImpl(Math.floor(Math.random() * x + 20), Math.floor(Math.random() * y + 20), 60);
hiveBall.speed = 0;
balls.push(hiveBall);
// Make sure the initial sugar position is far enough from the hive ball
while (Math.abs(hiveBall.x - sugarX) < 200 || Math.abs(hiveBall.y - sugarY) < 200) {
    sugarX = Math.floor(Math.random() * x + 20);
    sugarY = Math.floor(Math.random() * y + 20);
}
// Create a sugar ball and add it to the balls array
const sugarBall = new BallImpl(sugarX, sugarY, 35);
sugarBall.speed = 0;
balls.push(sugarBall);
function loop() {
    window.requestAnimationFrame(loop);
    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;
    context.canvas.height = height;
    context.canvas.width = width;
    // Initialize a counter to keep track
    antsAroundSugar = 0;
    // Loop through all balls and update their positions and behaviors.
    for (let index = 0; index < balls.length; index++) {
        //draw
        let ball = balls[index];
        context.fillStyle = ball.color;
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fill();
        ball.updatePosition(width, height);
        // Check if any ball is close to the sugar ball, and if so, add it to the ant takers list
        if (Math.hypot(ball.x - sugarBall.x, ball.y - sugarBall.y) < 30) {
            // Increment the counter of ants around the suga
            if (ball !== sugarBall && ball !== hiveBall) {
                antsAroundSugar++;
                dist = dist * (antsAroundSugar + 1);
                if (antsTakers.length !== numberOfAntsNeeded) {
                    if (!antsTakers.includes(ball))
                        antsTakers.push(ball);
                }
            }
        }
        // If enough ants are around the sugar, set the sugar ball to move towards the hive
        if (antsAroundSugar === numberOfAntsNeeded) {
            found = true;
            sugarBall.direction = Math.atan2(hiveBall.y - sugarBall.y, hiveBall.x - sugarBall.x);
            sugarBall.speed = backSpeed;
        }
    }
    if (sugarBall.x - hiveBall.x < 5 && sugarBall.y - hiveBall.y < 5) {
        refresh();
    }
    // Display the number of remaining ants needed on the sugar ball.
    context.fillStyle = "black";
    context.font = "30px Arial";
    let amount = numberOfAntsNeeded - antsAroundSugar;
    if (amount < 0)
        amount = 0;
    context.fillText(amount.toString(), sugarBall.x - 10, sugarBall.y + 5);
}
document.getElementById("canvas").style.display = "none";
const refresh = () => {
    location.reload();
    let refreshButton = document.getElementById("refresh");
    refreshButton.disabled = true;
};
function start() {
    document.getElementById("canvas").style.display = "block";
    let startButton = document.getElementById("start");
    startButton.disabled = true;
    let refreshButton = document.getElementById("refresh");
    refreshButton.disabled = false;
    // Randomly determine the number of ants needed between 1 and numberOfAnts.
    const numAntsInput = document.getElementById("numAnts");
    const numberOfAnts = parseInt(numAntsInput.value);
    numberOfAntsNeeded = Math.floor(Math.random() * numberOfAnts - 1) + 1;
    // Make sure numberOfAntsNeeded is not zero.
    while (numberOfAntsNeeded === 0) {
        numberOfAntsNeeded = Math.floor(Math.random() * numberOfAnts - 1) + 1;
    }
    // Create new ant balls and add them to the balls array.
    for (let index = 0; index < numberOfAnts; index++) {
        balls.push(new BallImpl(hiveBall.x, hiveBall.y, 10));
    }
    loop();
}
