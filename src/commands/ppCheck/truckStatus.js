const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const todayDate = new Date().toJSON();

//opal0744: 1,
dailyPP = {hemmie49: 1, gapytoad: 1, hel228: 1, imaginepigeons: 1};

const ppCheck = (size, status, curUser) => {
  dailyPP[curUser] = 1;
  console.log(dailyPP);

  const data = `${todayDate}: ${curUser} - ${size} - ${status}\n`

  fs.appendFile('ppCheck.log', data, (err) => {
    if (err) throw err
  })
  
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
      if (interaction.guildId === '690308107007557652') {
        if (interaction.channelId !== '1171394157475008572') {
          return await interaction.reply({ content: "Try this in #pp-check channel!", ephemeral: true });
        }
      }

      const truckStatus = ['hard', 'soft'];
      const size = Math.round(Math.random() * 15);
      const status = truckStatus[Math.floor(Math.random() * truckStatus.length)];
      const curUser = interaction.user.username;

      if (curUser in dailyPP) return await interaction.reply({ content: "You've already checked your pp today. Try again tomorrow!", ephemeral: true });
      
      return await interaction.reply(ppCheck(size, status, curUser));
    } catch (e) {
      let msg = `truckStatus.js:: ${todayDate}: ${e.message}\n`;

      fs.appendFile('errors.log', msg, (err) => {
        if (err) console.error(err)
      })
    }
  }
}