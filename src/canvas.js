let mousePosition = { x: 0, y: 0 };
let mouseDown = false;
let showCursorRadius = false;

window.addEventListener('mousemove', (event) => {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
});
window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mousePosition.x = event.touches[0].clientX;
        mousePosition.y = event.touches[0].clientY;
    }
}, { passive: true });
window.addEventListener('touchstart', (event) => {
    if (event.touches.length > 0) {
        mousePosition.x = event.touches[0].clientX;
        mousePosition.y = event.touches[0].clientY;
    }
});

window.addEventListener('touchend', (event) => {
    mouseDown = false;
    showCursorRadius = false;
}); 
window.addEventListener('mousedown', (event) => {
    mouseDown = true;
    showCursorRadius = true;
});
window.addEventListener('mouseup', (event) => {
    mouseDown = false;
    showCursorRadius = false;
});


function setupCanvas() {
    const canvas = document.getElementById('simulationCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return canvas.getContext('2d');
}

function render(context, particles) {
    // Set background to black
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    
    // Draw cursor radius indicator if mouse is down
    if (showCursorRadius) {
        const radius = 300;
        const { x, y } = mousePosition;
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(100,200,255,0.25)'); // Center: light blue, more visible
        gradient.addColorStop(0.7, 'rgba(100,200,255,0.10)'); // Mid: faint blue
        gradient.addColorStop(1, 'rgba(255,255,255,0.01)'); // Edge: almost transparent white
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();
    }

    particles.forEach(particle => {
        particle.draw(context);
    });
}