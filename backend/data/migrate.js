/**
 * One-time migration on startup:
 * - If a user has `password` (plaintext), bcrypt-hash it into `passwordHash` and delete `password`.
 * - Ensure required timestamps/fields exist.
 */

const bcrypt = require('bcryptjs');
const { db, saveAll } = require('./store');

async function migrate() {
  let changed = false;

  for (const user of db.users) {
    if (user.password && !user.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(user.password, salt);
      delete user.password;
      changed = true;
    }

    if (!user.region) {
      user.region = 'Unknown';
      changed = true;
    }
  }

  for (const p of db.produce) {
    if (!p.createdAt) {
      p.createdAt = new Date().toISOString();
      changed = true;
    }
    if (!p.region && p.farmerId) {
      const farmer = db.users.find((u) => u.id === p.farmerId);
      if (farmer?.region) {
        p.region = farmer.region;
        changed = true;
      }
    }
    if (!p.ripeningStatus) {
      p.ripeningStatus = p.agentId ? 'pending' : null;
      changed = true;
    }
  }

  for (const o of db.orders) {
    if (!o.createdAt) {
      o.createdAt = new Date().toISOString();
      changed = true;
    }
  }

  if (changed) {
    saveAll();
    console.log('✅ Data migration applied (hashed seed passwords / filled defaults).');
  }
}

module.exports = { migrate };

