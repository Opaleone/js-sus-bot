const { SlashCommandBuilder, GuildApplicationCommandManager } = require('discord.js');
const fs = require("fs");
const config = require('../../../config.json');
const { default: axios } = require('axios');
const { interInfo } = require('../../../utils/interInfo');

const ppCheck = (size, status) => {
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
      const getInterInfo = interInfo(interaction);
      const truckStatus = ['hard', 'soft'];

      const size = Math.round(Math.random() * 15);
      const status = truckStatus[Math.floor(Math.random() * truckStatus.length)];

      if (config.debug.status) {
        if (!config.debug.channels.includes(interaction.channelId)) {
          return await interaction.reply({ content: "Currently testing bot. Try again later!", ephemeral: true });
        }
      }
      
      // Checks if command is being used in the correct channel
      if (interaction.guildId === '690308107007557652') {
        if (interaction.channelId !== '1171394157475008572') {
          return await interaction.reply({ content: "Try this in #pp-check channel!", ephemeral: true });
        }
      }

      const checkCreate = await axios.post(`${config.baseUrl}checks/`, {
        ...getInterInfo,
        size: size,
        status: status
      });

      return await interaction.reply(ppCheck(checkCreate.data.size, checkCreate.data.status));
    } catch (e) {
      const todayDate = new Date().toJSON();
      const msg = `${todayDate}: ${e.message} ::truckStatus.js::\n`;

      // Log error to file
      fs.appendFile('errors.log', msg, (err) => {
        if (err) console.error(err)
      })
    }
  }
}