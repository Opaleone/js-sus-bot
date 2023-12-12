const { SlashCommandBuilder } = require('discord.js');

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
      let ppAvg = {};

      const file = fs.readFileSync('ppCheck.log', function(err, data) {
        console.log(data);
      })
      
      const fileArr = file.toString().split(`\n`);
      fileArr.pop();
      
      for (let i = 0; i < fileArr.length; i++) {
        const cur = fileArr[i];
        const curArr = cur.split(' ');
      
        if (curArr[1] === curUser) {
          let curObj = {
            total: parseInt(curArr[3]),
            count: 1
          }
        
          if (ppAvg[curArr[1]]) {
            ppAvg[curArr[1]].count++;
            ppAvg[curArr[1]].total += parseInt(curArr[3]);
          } else {
            ppAvg[curArr[1]] = curObj;
          }
        }
      }

      const average = (ppAvg[curUser].total / ppAvg[curUser].count).toFixed(2);

      if (ppAvg[curUser]) return await interaction.reply(`Your average peen size is ${average} inches.`); 
      else return await interaction.reply({ content: `You haven't done a pp check yet.\n\nGet checked by yours truly with /pp.`, ephemeral: true });
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