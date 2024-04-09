const { default: axios } = require('axios');
const config = require('../config.json')

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
  }
}