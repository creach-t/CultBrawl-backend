const schedule = require('node-schedule');
const { Battle } = require('../models');

// Planifie une tâche toutes les minutes
schedule.scheduleJob('* * * * *', async () => {
  console.log('Vérification des battles expirées...');
  await Battle.updateExpiredBattles();
});
