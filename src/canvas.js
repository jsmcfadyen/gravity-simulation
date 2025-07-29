let mousePosition = { x: 0, y: 0 };
let mouseDown = false;
let showCursorRadius = false;
let showControls = false;

window.addEventListener('mousemove', (event) => {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
});
window.addEventListener('mousedown', (event) => {
    mouseDown = true;
    showCursorRadius = true;
});
window.addEventListener('mouseup', (event) => {
    mouseDown = false;
    showCursorRadius = false;
});
window.addEventListener('resize', () => {
    const canvas = document.getElementById('simulationCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
window.addEventListener('keydown', (event) => {
    if (event.key === 'Space') {
        if (showControls) {
            const controlsPanel = document.getElementById('controls-panel');
            if (controlsPanel) {
                controlsPanel.style.display = 'none';
            }
            showControls = false;
        }
        else{
            let controlsPanel = document.getElementById('controls-panel');
            if (controlsPanel) {
                controlsPanel.style.display = 'block';
            }else{
                addControls()
            }
            showControls = true;
        }
    }
});

function setupCanvas() {
    const canvas = document.getElementById('simulationCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.style.overflow = 'hidden'; // To disable scrolling
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

// Add controls UI
function addControls() {
    const controls = document.createElement('div');
    controls.id = 'controls-panel';
    controls.style.position = 'fixed';
    controls.style.top = '20px';
    controls.style.left = '20px';
    controls.style.background = 'rgba(30,30,40,0.85)';
    controls.style.color = '#fff';
    controls.style.padding = '12px 18px';
    controls.style.borderRadius = '10px';
    controls.style.zIndex = 1000;
    controls.style.fontFamily = 'sans-serif';
    controls.innerHTML = `
        <label>Gravity Strength: <input id="gravityStrength" type="range" min="0.01" max="1" step="0.01" value="0.25"></label>
        <span id="gravityValue">0.10</span><br>
        <button id="resetParticles">Reset</button>
    `;
    document.body.appendChild(controls);

    // Update gravity value display
    const gravitySlider = document.getElementById('gravityStrength');
    const gravityValue = document.getElementById('gravityValue');
    gravitySlider.addEventListener('input', () => {
        gravityValue.textContent = gravitySlider.value;
    });
}