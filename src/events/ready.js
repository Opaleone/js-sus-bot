const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    const guilds = client.guilds.cache.map(guild => guild);

    client.user.setActivity('for SUS messages...', { type: ActivityType.Watching })

    console.log(`Ready! Logged in as ${client.user.tag}`);
    for (const guild of guilds) {
      console.log(`Joined ${guild.name}: ${guild.id}`);
    }
  }
}