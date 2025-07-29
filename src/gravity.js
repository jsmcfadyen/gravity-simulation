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
        this.trail = [];
        this.trailLength = 20; // Number of previous positions to keep
        if (color) {
            this.color = color;
        } else {
            const hue = Math.floor(Math.random() * 360);
            this.color = `hsl(${hue}, 70%, 85%)`;
        }
    }

    update(particles) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Cursor gravity (always applies, but stronger when mouseDown)
        const cursorRadius = 300;
        const dxMouse = mousePosition.x - this.x;
        const dyMouse = mousePosition.y - this.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < cursorRadius) {
            // Always apply a small gravity effect
            const baseForce = (this.mass * 0.02) / (distMouse * distMouse + 0.1);
            const angle = Math.atan2(dyMouse, dxMouse);
            this.velocity.x += Math.cos(angle) * baseForce * 100;
            this.velocity.y += Math.sin(angle) * baseForce * 100;
            // If mouse is down, apply a much stronger effect
            if (mouseDown) {
                const strongForce = (this.mass * 0.5) / (distMouse * distMouse + 0.1);
                this.velocity.x += Math.cos(angle) * strongForce * 500;
                this.velocity.y += Math.sin(angle) * strongForce * 500;
            }
        }

        // Inter-particle gravity (only if close enough)
        const gravityRadius = 120; // Only apply gravity if within this distance
        const G = 0.25; // Gravitational constant for simulation
        for (let other of particles) {
            if (other === this) continue;
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
            // --- Collision detection and response (only for similar colors) ---
            const minDist = (5 * this.mass) + (5 * other.mass); // Approximate sum of radii
            // Compare hue values for color similarity
            const getHue = color => parseInt(color.match(/\d+/)[0], 10);
            const hue1 = getHue(this.color);
            const hue2 = getHue(other.color);
            const hueDiff = Math.abs(hue1 - hue2);
            const hueThreshold = 30; // Adjust for how similar colors must be (0-360)
            if (hueDiff <= hueThreshold || hueDiff >= 360 - hueThreshold) {
                if (distSq < minDist * minDist && distSq > 0.1) {
                    const distance = Math.sqrt(distSq);
                    const overlap = 0.5 * (distance - minDist);
                    // Move particles apart
                    this.x -= overlap * (this.x - other.x) / distance;
                    this.y -= overlap * (this.y - other.y) / distance;
                    other.x += overlap * (this.x - other.x) / distance;
                    other.y += overlap * (this.y - other.y) / distance;
                    // Mass-aware elastic collision
                    const m1 = this.mass;
                    const m2 = other.mass;
                    const v1x = this.velocity.x;
                    const v1y = this.velocity.y;
                    const v2x = other.velocity.x;
                    const v2y = other.velocity.y;
                    // 1D elastic collision equations for each axis
                    this.velocity.x = (v1x * (m1 - m2) + 2 * m2 * v2x) / (m1 + m2);
                    this.velocity.y = (v1y * (m1 - m2) + 2 * m2 * v2y) / (m1 + m2);
                    other.velocity.x = (v2x * (m2 - m1) + 2 * m1 * v1x) / (m1 + m2);
                    other.velocity.y = (v2y * (m2 - m1) + 2 * m1 * v1y) / (m1 + m2);
                }
            }
        }

        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
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

    }

    draw(ctx) {
        // Create a radial gradient for a pastel-to-transparent effect
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
