const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve files from C:\dev\javafxmap\node\web\map at /map
const mapDir = path.join('C:', 'dev', 'javafxmap', 'node', 'web', 'map');
app.use('/map', express.static(mapDir));

const mapStaticDir = path.join('C:', 'dev', 'javafxmap', 'node', 'web', 'map','static');
app.use('/map_static', express.static(mapStaticDir));

const mapImage = path.join('C:', 'dev', 'mapimages', 'satellite');
app.use('/mapimage', express.static(mapImage));

// app.get('/', (req, res) => {
//   res.send('Hello from Node server!');
// });
const root = path.join('C:', 'dev', 'javafxmap', 'node', 'web', 'map');
app.use('/', express.static(root));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});