const express = require('express');
const bonjour = require('bonjour')();
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// In-memory device store
let devices = {};

// Helper to purge devices inactive for more than 14 days
function purgeOldDevices() {
  const now = Date.now();
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  for (const id in devices) {
    if (now - devices[id].lastSeen > fourteenDays) {
      delete devices[id];
    }
  }
}

// Perform mDNS discovery
function discoverDevices() {
  console.log('Starting mDNS discovery...');
  const found = {};

  const browser = bonjour.find({ type: 'matter' }, (service) => {
    const id = service.name || service.fqdn;
    const capabilities = service.txt || {};

    // Try to extract a friendly name from TXT records or service name
    const friendlyName =
      capabilities.friendlyname ||
      capabilities.name ||
      service.txt?.dn ||
      service.txt?.n ||
      service.name ||
      id;

    found[id] = {
      id,
      name: friendlyName,
      ip: service.addresses[0],
      type: service.type,
      port: service.port,
      capabilities,
      lastSeen: Date.now(),
      active: true,
    };
  });

  // Stop discovery after 10 seconds
  setTimeout(() => {
    browser.stop();

    // Update device list
    for (const id in devices) {
      devices[id].active = false;
    }

    for (const id in found) {
      devices[id] = found[id];
    }

    purgeOldDevices();
    console.log('Discovery complete. Devices:', Object.keys(devices).length);
  }, 10000);
}

// Run discovery every 60 seconds
discoverDevices();
setInterval(discoverDevices, 60000);

// API endpoints
app.get('/devices', (req, res) => {
  res.json(Object.values(devices));
});

app.get('/devices/:id', (req, res) => {
  const device = devices[req.params.id];
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ error: 'Device not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Matter Display server running at http://localhost:${PORT}`);
});
