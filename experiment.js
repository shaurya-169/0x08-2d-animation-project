// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let arrow = { x: 50, y: canvas.height / 2, angle: 0, power: 0, isShot: false };
const target = { x: canvas.width - 50, y: canvas.height / 2, radius: 20 };
let attempts = 3;
let score = 0;

// Player information
const playerNameElement = document.getElementById('name');
const playerRollNoElement = document.getElementById('rollNo');
const playerName = 'Gurdit';
const playerRollNo = '102003011';

// Update player information display
playerNameElement.textContent = `Name: ${playerName}`;
playerRollNoElement.textContent = `Roll No: ${playerRollNo}`;

// Function to draw the arrow and target
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw target
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw arrow
    if (arrow.isShot) {
        ctx.save();
        ctx.translate(arrow.x, arrow.y);
        ctx.rotate(arrow.angle);
        ctx.fillStyle = 'black';
        ctx.fillRect(-15, -3, 30, 6);
        ctx.restore();
    }

    // Display attempts and score
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Attempts: ${attempts}`, 10, 20);
    ctx.fillText(`Score: ${score}`, 10, 40);
}

// Function to update game state
function update() {
    if (arrow.isShot) {
        // Update arrow position based on power and angle
        arrow.x += Math.cos(arrow.angle) * arrow.power;
        arrow.y += Math.sin(arrow.angle) * arrow.power;

        // Check for collision with target
        if (distance(arrow.x, arrow.y, target.x, target.y) < target.radius) {
            score += 10;
            arrow.isShot = false;
            resetArrow();
            if (score % 50 === 0) {
                attempts++;
            }
        } else if (arrow.x > canvas.width || arrow.y > canvas.height || arrow.y < 0) {
            attempts--;
            if (attempts <= 0) {
                gameOver();
            } else {
                resetArrow();
            }
        }
    }
}

// Reset arrow to initial position and state
function resetArrow() {
    arrow.x = 50;
    arrow.y = canvas.height / 2;
    arrow.angle = 0;
    arrow.power = 0;
    arrow.isShot = false;
}

// Game over function
function gameOver() {
    alert(`Game Over! Your final score is ${score}`);
    attempts = 3;
    score = 0;
    resetArrow();
}

// Calculate distance between two points
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Handle mouse click to shoot arrow
canvas.addEventListener('mousedown', (e) => {
    if (!arrow.isShot && attempts > 0) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate angle and power
        arrow.angle = Math.atan2(mouseY - arrow.y, mouseX - arrow.x);
        arrow.power = distance(arrow.x, arrow.y, mouseX, mouseY) * 0.1;

        arrow.isShot = true;
    }
});

// Game loop
function gameLoop() {
    update();
    draw();
    
    if (attempts > 0) {
        requestAnimationFrame(gameLoop);
    }
}

// Start the game loop
gameLoop();
