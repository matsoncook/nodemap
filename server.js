const express = require('express');
const path = require('path');
const app = express();

// Replit uses a system-assigned port
const PORT = process.env.PORT || 3000;

// Use __dirname to resolve relative paths
const mapDir = path.join(__dirname, 'web', 'map');
app.use('/map', express.static(mapDir));

const mapStaticDir = path.join(__dirname, 'web', 'map', 'static');
app.use('/map_static', express.static(mapStaticDir));

const mapImage = path.join(__dirname, 'mapimages', 'satellite');
app.use('/mapimage', express.static(mapImage));

// Serve the root map folder at /
app.use('/', express.static(mapDir));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});