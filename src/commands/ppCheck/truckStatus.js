const { SlashCommandBuilder } = require('discord.js');
dailyPP = {};

const ppCheck = (size, status, curUser) => {
  dailyPP[curUser] = 1;
  console.log(dailyPP);
  
  switch(size) {
    case (size > 8):
      return `You are ${size} inches ${status}.\n:eggplant:`;
      break;
    case (size <= 3):
      return `You are ${size} inches ${status}.\n:microscope:`;
      break;
    default:
      return `You are ${size} inches ${status}.\n:fried_shrimp:`;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
      .setName('pp')
      .setDescription('PP CHECK!'),
    async execute(interaction) {
      if (interaction.guildId === '690308107007557652') {
        if (interaction.channelId !== '1171394157475008572') {
          await interaction.reply({ content: "Command must be run in #pp-check channel!", ephemeral: true });
          return;
        }
      }

      const truckStatus = ['hard', 'soft'];
      const size = Math.round(Math.random() * 15);
      const status = truckStatus[Math.floor(Math.random() * truckStatus.length)];
      const curUser = interaction.user.username;

      if (curUser in dailyPP) {
        await interaction.reply({ content: "You've already checked your pp today. Try again tomorrow!", ephemeral: true });
      } else {
        await interaction.reply(ppCheck(size, status, curUser));
      }
    }
}