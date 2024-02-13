const { default: axios } = require('axios');
const config = require('../config.json')
const { interInfo } = require('./interInfo');

const restrictionFinder = async (interaction) => {
  const getInterInfo = interInfo(interaction);
  const dbGuild = await axios.get(`${config.baseUrl}/guild/${getInterInfo.gid}/${getInterInfo.guildname}`);
  let restriction = {}

  if (dbGuild.data.channelId) {
    const channel = interaction.member.guild.channels.cache.find(channel => channel.id === dbGuild.data.channelId);

    restriction = {
      guildId: dbGuild.data.guildId,
      channelName: channel.name,
      channelId: dbGuild.data.channelId
    }
  }

  return restriction;
};

module.exports = restrictionFinder;