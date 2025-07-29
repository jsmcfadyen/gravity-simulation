# Gravity Simulation

This project is a simple gravity simulation implemented in JavaScript using an HTML5 canvas. It demonstrates the basic principles of particle motion under the influence of gravity.

## Project Structure

```
gravity-simulation
├── src
│   ├── gravity.js      # Contains the logic for simulating gravity with the Particle class
│   └── canvas.js       # Handles the 2D canvas setup and rendering
├── index.html          # Main HTML file for the simulation
├── style.css           # Styles for the webpage
└── README.md           # Documentation for the project
```

## Getting Started

To run the gravity simulation, follow these steps:

1. Clone the repository or download the project files.
2. Open `index.html` in a web browser.
3. You should see a canvas displaying particles affected by gravity.

## How It Works

- The `Particle` class in `src/gravity.js` defines the properties and methods for each particle, including its position and velocity.
- The `setupCanvas` and `render` functions in `src/canvas.js` are responsible for initializing the canvas and drawing the particles on it.
- The simulation runs continuously, updating the position of each particle based on the gravitational force.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add!