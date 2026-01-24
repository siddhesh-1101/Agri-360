/**
 * Simple JSON-backed data store (no real database).
 * Loads data from /data/*.json into memory and persists on changes.
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname);

const files = {
  users: path.join(dataDir, 'users.json'),
  produce: path.join(dataDir, 'produce.json'),
  orders: path.join(dataDir, 'orders.json'),
};

// In-memory data
const db = {
  users: [],
  produce: [],
  orders: [],
};

function safeReadJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error('Error reading JSON file', filePath, err.message);
    return fallback;
  }
}

function safeWriteJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing JSON file', filePath, err.message);
  }
}

function loadAll() {
  db.users = safeReadJSON(files.users, []);
  db.produce = safeReadJSON(files.produce, []);
  db.orders = safeReadJSON(files.orders, []);
}

function saveAll() {
  safeWriteJSON(files.users, db.users);
  safeWriteJSON(files.produce, db.produce);
  safeWriteJSON(files.orders, db.orders);
}

// Simple ID generator
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Load data at startup
loadAll();

module.exports = {
  db,
  loadAll,
  saveAll,
  generateId,
};

