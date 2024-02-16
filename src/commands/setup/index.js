const { default: axios } = require('axios');
const config = require('../../../config.json');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('setup')
      .setDescription('Set guild options')
      .addIntegerOption(option => {
        return option
          .setName('checkamount')
          .setDescription('Number of checks to perform per day')
      })
      .addStringOption(option => {
        return option
          .setName('channelid')
          .setDescription('Channel to restrict checks to')
      })
      .setDefaultMemberPermissions(0),
  async execute(interaction) {
    try {
      const editData = {
        guildId: interaction.guildId,
        guildName: interaction.member.guild.name,
        channelId: interaction.options.getString('channelid') ?? null,
        checkAmount: interaction.options.getInteger('checkamount') ?? null
      }
  
      await axios.put(`${config.baseUrl}/guild/edit`, editData)
  
      return await interaction.reply({ content: `Successfully updated your guild!`, ephemeral: true });
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