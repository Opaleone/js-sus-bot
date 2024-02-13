const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../../config.json');
const { interInfo } = require('../../../utils/interInfo');
const { default: axios } = require('axios');
const restrictionFinder = require('../../../utils/restrictChannels');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('average')
      .setDescription('Your average so far...'),
  async execute(interaction) {
    try {
      const restriction = await restrictionFinder(interaction);
      const getInterInfo = interInfo(interaction);

      if (config.debug.status) {
        if (!config.debug.channels.includes(interaction.channelId)) {
          return await interaction.reply({ content: "Currently testing bot. Try again later!", ephemeral: true });
        }
      }

      if (interaction.guildId === restriction.guildId) {
        if (interaction.channelId !== restriction.channelId) {
          return await interaction.reply({ content: `Try this in #${restriction.channelName} channel!`, ephemeral: true });
        }
      }

      const allChecks = await axios.get(`${config.baseUrl}/checks/allUserChecks`, {
        params: {
          ...getInterInfo
        }
      });

      if (!Object.keys(allChecks.data).length) {
        return await interaction.reply({ content: `You haven't done a pp check yet.\n\nGet checked by yours truly with /pp.`, ephemeral: true });
      }

      let tempHash = {
        count: 0,
        total: 0
      };

      for (const check of allChecks.data) {
        tempHash.count++;
        tempHash.total += check.size;
      }

      const avg = (tempHash.total / tempHash.count).toFixed(1);

      return await interaction.reply(`You're average peen size is ${avg} inches.`)
    } catch (e) {
      const todayDate = new Date().toJSON();
      const msg = `${todayDate}: ${e.message} ::average.js::\n`;

      // Log error to file
      fs.appendFile('errors.log', msg, (err) => {
        if (err) console.error(err)
      })
    }
  }
}