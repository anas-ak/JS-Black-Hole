console.clear();

// declare three variables for the screen dimensions
let screenWidth, screenHeight, smallerSize;

const Z_RANGE = 100; // How deep is the rabbit hole
const Z_VELOCITY = -0.0025 ; // Full speed ahead
const STARS_COUNT = 2000;   // How many of us?

// declare a function that sets the screen dimensions according to the window
const setSizes = () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    smallerSize = screenWidth > screenHeight ? screenHeight : screenWidth;
} 
setSizes();

// declare an object that is the HOLE
const HOLE = {
    x: screenWidth / 2,
    y: screenHeight / 2,
    r: smallerSize / 4
};

// declare a class called Star
class Star {
    constructor(){
        this.reset();
    }
    reset() {
        this.x = 1 - Math.random() * 2;
        this.y = 1 - Math.random() * 2;
        this.z = Math.random() * -Z_RANGE;
        this.xPos = 0;
        this.yPos = 0;
        this.angle = 0.001;
    };
    
    getPosition() {
        this.x = this.x * Math.cos(this.angle) - this.y * Math.sin(this.angle);
        this.y = this.y * Math.cos(this.angle) + this.x * Math.sin(this.angle);
        this.z += Z_VELOCITY;

        this.xPos = 
        screenHeight / screenWidth * screenWidth * this.x / this.z + 
        screenWidth / 2;
        this.yPos = screenHeight * this.y / this.z + screenHeight / 2;

        // Detect collision with the Black Hole
        if (Math.sqrt((this.xPos-HOLE.x)*(this.xPos-HOLE.x) + (this.yPos-HOLE.y) * (this.yPos-HOLE.y)) <= HOLE.r || this.z >= Z_RANGE) this.reset();
    }
    // run the draw function 
    draw() {
        const size = 3 - -this.z / 2;

        ctx.globalAlpha = (Z_RANGE + this.z) / (Z_RANGE * 2);
        ctx.fillStyle = "white";
        ctx.fillRect(this.xPos, this.yPos, size, size);
        ctx.globalAlpha = 1;
    };
}

const stars = new Array(STARS_COUNT);

for(let i = 0; i < STARS_COUNT; i++) stars[i] = new Star();

// create a canvas element
const canvas = document.createElement("canvas");

// set the canvas width & height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// declare an animate function - no parameters
const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.fillStyle = "white";
    stars.forEach(star => {
        star.getPosition();
        star.draw();
    })
    ctx.fill();
    
    requestAnimationFrame(animate);
}

window.addEventListener('resize', e => {
    setSizes();
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    HOLE.r = smallerSize / 4;
    HOLE.x = screenWidth / 2;
    HOLE.y = screenHeight / 2;
});

animate();

