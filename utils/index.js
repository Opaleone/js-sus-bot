const { default: axios } = require('axios');
const config = require('../config.json')
const net = require("net");
const fs = require('node:fs');

module.exports = {
  interInfo: (interaction) => {
    const interInfo = {
      uid: interaction.user.id,
      gid: interaction.guildId,
      username: interaction.user.username,
      guildname: interaction.member.guild.name,
    }
    return interInfo;
  },
  wordsAndPhrases: async () => {
    const susWords = await axios.get(`${config.baseUrl}/suspicious/`);
    const susResponses = await axios.get(`${config.baseUrl}/responses/`);
  
    return { susWords, susResponses };
  },
  restrictionFinder: async (interaction) => {
    const dbGuild = await axios.get(`${config.baseUrl}/guild/${interaction.guildId}/${interaction.member.guild.name}`);
    let restriction = {};
  
    if (dbGuild.data.channelId) {
      const channel = interaction.member.guild.channels.cache.find(channel => channel.id === dbGuild.data.channelId);
  
      restriction = {
        guildId: dbGuild.data.guildId,
        channelName: channel.name,
        channelId: dbGuild.data.channelId
      }
    }
  
    return restriction;
  },
  sleep: async (t) => {
    // sleeps for a random amount of time between 0 and t
    const randomMs = Math.floor(Math.random() * t)
    await new Promise(res => setTimeout(res, randomMs));
  },
  hawkeyeConnect: () => {
    const client = new net.Socket();

    const data = `${process.pid} SusBot ${config.hawkeye.hawkeyeKey}`;

    client.connect(config.hawkeye.port, config.hawkeye.host, () => {
      client.write(data);
      client.end();
      console.log("Connected to Hawkeye, sending PID...");
    })

    client.on('error', (e) => {
      const todayDate = new Date().toJSON();
      const msg = `${todayDate}: ${e} ::hawkeye connect::\n`;

      // Log error to file
      fs.appendFile('errors.log', msg, (err) => {
        if (err) console.error(err)
      })
    })
  }
}