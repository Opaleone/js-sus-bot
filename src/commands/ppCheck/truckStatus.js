const { SlashCommandBuilder } = require('discord.js');

dailyPP = {};

const ppCheck = (size, status, curUser) => {
  dailyPP[curUser] = 1;
  console.log(dailyPP);
  if (size > 8) {
    return `You are ${size} inches ${status}.\n:eggplant:`
  } else if (size <= 3) {
    return `You are ${size} inches ${status}.\n:microscope:`
  } else {
    return `You are ${size} inches ${status}.\n:fried_shrimp:`
  }
}

module.exports = {
  data: new SlashCommandBuilder()
      .setName('pp')
      .setDescription('PP CHECK!'),
    async execute(interaction) {
      if (interaction.guildId === '690308107007557652') {
        if (interaction.channelId !== '1171394157475008572') {
          return;
        }
      }

      const truckStatus = ['hard', 'soft'];
      const size = Math.round(Math.random() * 15);
      const status = truckStatus[Math.floor(Math.random() * truckStatus.length)];
      const curUser = interaction.user.username

      if (curUser in dailyPP) {
        await interaction.reply({ content: "You've already checked your pp today. Try again tomorrow!", ephemeral: true })
      } else {
        await interaction.reply(ppCheck(size, status, curUser))
      }
    }
}