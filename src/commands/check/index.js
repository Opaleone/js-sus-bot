const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const config = require('../../../config.json');
const { default: axios } = require('axios');
const { interInfo, restrictionFinder } = require('../../../utils/index');

const check = (size, status) => {
  if (size > 8) {
    return `You are ${size} inches ${status}.\n:eggplant:`;
  } else if (size <= 3) {
    return `You are ${size} inches ${status}.\n:microscope:`;
  } else {
    return `You are ${size} inches ${status}.\n:fried_shrimp:`;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
      .setName('pp')
      .setDescription('PP CHECK!'),
  async execute(interaction) {
    try {
      const restriction = await restrictionFinder(interaction);

      // for debugging
      if (config.debug.status) {
        if (!config.debug.channels.includes(interaction.channelId)) {
          return await interaction.reply({ content: "Currently testing bot. Try again later!", ephemeral: true });
        }
      }
      
      // Checks if command is being used in the correct channel
      if (interaction.guildId === restriction.guildId) {
        if (interaction.channelId !== restriction.channelId) {
          return await interaction.reply({ content: `Try this in #${restriction.channelName}!`, ephemeral: true });
        }
      }

      const getInterInfo = interInfo(interaction);
      const dbGuild = await axios.get(`${config.baseUrl}/guild/${getInterInfo.gid}/${getInterInfo.guildname}`);

      if (dbGuild.data.checkAmount) {
        const allTodayChecks = await axios.get(`${config.baseUrl}/checks/todayChecks`, {
          params: {
            ...getInterInfo
          }
        })

        if (Object.keys(allTodayChecks.data).length >= dbGuild.data.checkAmount) {
          return await interaction.reply({ content: `You've already been checked ${dbGuild.data.checkAmount} ${dbGuild.data.checkAmount > 1 ? 'times' : 'time'} today. Try again tomorrow!`, ephemeral: true });
        }
      }

      const status = ['hard', 'soft'];
      const size = Math.round(Math.random() * 15);
      const randStatus = status[Math.floor(Math.random() * status.length)];

      const checkCreate = await axios.post(`${config.baseUrl}/checks/`, {
        ...getInterInfo,
        date: new Date().toLocaleDateString(),
        size: size,
        status: randStatus
      });

      return await interaction.reply(check(checkCreate.data.size, checkCreate.data.status));
    } catch (e) {
      const todayDate = new Date().toJSON();
      const msg = `${todayDate}: ${e} ::check.js::\n`;

      // Log error to file
      fs.appendFile('errors.log', msg, (err) => {
        if (err) console.error(err)
      })
    }
  }
}