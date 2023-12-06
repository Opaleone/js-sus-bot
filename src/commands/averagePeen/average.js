const { SlashCommandBuilder } = require('discord.js');
const ppAvg = require('../../../utils/calculateAvg');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('average')
      .setDescription('Your average so far...'),
  async execute(interaction) {
    try {
      if (interaction.guildId === '690308107007557652') {
        if (interaction.channelId !== '1171394157475008572') {
          return await interaction.reply({ content: "Try this in #pp-check channel!", ephemeral: true });
        }
      }

      const curUser = interaction.user.username;
      const average = (ppAvg[curUser].total / ppAvg[curUser].count).toFixed(2);
      
      if (ppAvg[curUser]) return await interaction.reply(`Your average peen size is ${average} inches.`); 
      else return await interaction.reply({ content: `You haven't done a pp check yet.\n\nGet checked by yours truly with /pp.`, ephemeral: true });
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