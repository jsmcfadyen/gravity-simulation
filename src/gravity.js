class Particle {
    constructor(x, y, mass, color) {
        this.x = x;
        this.y = y;
        this.velocity = {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1
        };
        if (mass){
            this.mass = mass;
        }else{
            this.mass = Math.random() * 5 + 1; // Random mass between 1 and 6
        }

        if (color) {
            this.color = color;
        } else {
            const hue = Math.floor(Math.random() * 360);
            this.color = `hsl(${hue}, 70%, 85%)`;
        }
    }

    update(particles) {
        // Cursor gravity (always applies, but stronger when mouseDown)
        const cursorRadius = 300;
        const cursorGravity = 0.02; // Base gravity effect
        const clickGravity = 0.5; // Stronger gravity when mouse is down
        const dxMouse = mousePosition.x - this.x;
        const dyMouse = mousePosition.y - this.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < cursorRadius) {
            const baseForce = (this.mass * cursorGravity) / (distMouse * distMouse + .1);
            const angle = Math.atan2(dyMouse, dxMouse);
            this.velocity.x += Math.cos(angle) * baseForce * 100;
            this.velocity.y += Math.sin(angle) * baseForce * 100;
            if (mouseDown) {
                const strongForce = (this.mass * clickGravity) / (distMouse * distMouse + 0.1);
                this.velocity.x += Math.cos(angle) * strongForce * 500;
                this.velocity.y += Math.sin(angle) * strongForce * 500;
            }
        }

        // Inter-particle gravity (only if close enough)
        const gravityRadius = 500; // Only apply gravity if within this distance
        const G = 0.25; // Gravitational constant for simulation
        for (let other of particles) {
            if (other === this) continue;
            const mouseDx = mousePosition.x - this.x;
            const mouseDy = mousePosition.y - this.y;
            const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)
            if (mouseDown && mouseDist < gravityRadius) {
                continue
            }
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < gravityRadius * gravityRadius && distSq > 1) {
                const distance = Math.sqrt(distSq);
                const force = (G * this.mass * other.mass) / distSq;
                const angle = Math.atan2(dy, dx);
                this.velocity.x += Math.cos(angle) * force / this.mass;
                this.velocity.y += Math.sin(angle) * force / this.mass;
            }
        }

        // Simple boundary collision
        if (this.x < 0 || this.x > canvas.width) {
            this.velocity.x *= -1;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.velocity.y *= -1;
        }

        // Limit velocity to prevent particles from moving too fast
        if (this.velocity.x > 5) {
            this.velocity.x = 5;
        }
        if (this.velocity.x < -5) {
            this.velocity.x = -5;
        }
        if (this.velocity.y > 5) {
            this.velocity.y = 5;
        }
        if (this.velocity.y < -5) {
            this.velocity.y = -5;
        }
        
        // Apply friction
        if (this.velocity.x > 0.5){
            this.velocity.x *= 0.99; // Friction factor
        }
        if (this.velocity.y > 0.5){
            this.velocity.y *= 0.99; // Friction factor
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw(ctx) {
        const radius = 5 * this.mass;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
        gradient.addColorStop(0, this.color.replace('hsl', 'hsla').replace(')', ',1)'));
        gradient.addColorStop(1, this.color.replace('hsl', 'hsla').replace(')', ',0)'));
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}
