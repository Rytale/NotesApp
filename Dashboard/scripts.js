function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

window.onload = function() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particlesArray = [];
    const colors = ['#0077b6', '#00d4ff', '#f72585', '#4361ee'];
    const mouse = {
        x: null,
        y: null,
        radius: 100 // Interaction radius
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.velocityX = Math.random() * 0.2 - 0.1; // Slower passive speed
            this.velocityY = Math.random() * 0.2 - 0.1; // Slower passive speed
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.driftRange = 100;
            this.maxSpeed = .5; // Maximum speed limit for particles
        }

        update() {
            // Calculate distance between particle and mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply a gentle repulsion effect when particles get close to the mouse
            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const forceX = Math.cos(angle) * 0.03; // Smaller force for subtle interaction
                const forceY = Math.sin(angle) * 0.03;
                this.velocityX -= forceX;
                this.velocityY -= forceY;
            } else {
                // Gradually return particles to their original positions
                if (Math.abs(this.x - this.baseX) > this.driftRange) {
                    this.velocityX -= (this.x - this.baseX) / 200;
                }
                if (Math.abs(this.y - this.baseY) > this.driftRange) {
                    this.velocityY -= (this.y - this.baseY) / 200;
                }
            }

            // Ensure velocity remains within the max speed limit
            this.velocityX = Math.min(Math.max(this.velocityX, -this.maxSpeed), this.maxSpeed);
            this.velocityY = Math.min(Math.max(this.velocityY, -this.maxSpeed), this.maxSpeed);

            // Update particle position with smooth motion
            this.x += this.velocityX;
            this.y += this.velocityY;

            // Apply a very small constant random movement
            this.velocityX += Math.random() * 0.05 - 0.025;
            this.velocityY += Math.random() * 0.05 - 0.025;

            // Bounce particles off the edges of the canvas
            if (this.x < 0 || this.x > canvas.width) this.velocityX *= -0.8; // Dampen speed on bounce
            if (this.y < 0 || this.y > canvas.height) this.velocityY *= -0.8; // Dampen speed on bounce
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function init() {
        particlesArray.length = 0;
        for (let i = 0; i < 100; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
};
