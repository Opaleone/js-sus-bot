const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../../config.json');
const { restrictionFinder } = require('../../../utils/index');
const { default: axios } = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('add')
      .setDescription('Add a suspicious word or phrase to respond with')
      .addStringOption(option => {
        return option
          .setName('susword')
          .setDescription('Suspicious word to add')
      })
      .addStringOption(option => {
        return option
          .setName('susresponse')
          .setDescription('Response for bot to use when sus word detected')
      }),
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

      const tempObj = {
        word: interaction.options.getString('susword') ?? null,
        phrase: interaction.options.getString('susresponse') ?? null
      }
  
      if (tempObj.word) {
        await axios.post(`${config.baseUrl}/suspicious/${tempObj.word}`)
      }
  
      if (tempObj.phrase) {
        await axios.post(`${config.baseUrl}/responses/${tempObj.phrase}`)
      }

      await interaction.reply({ content: "Successfully added!", ephemeral: true });
    } catch (e) {
      const todayDate = new Date().toJSON();
      const msg = `${todayDate}: ${e.message} ::add.js::\n`;

      // Log error to file
      fs.appendFile('errors.log', msg, (err) => {
        if (err) console.error(err)
      })
    }
  }
}