const { default: axios } = require('axios');
const config = require('../../../config.json');
const { SlashCommandBuilder, GuildApplicationCommandManager, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

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
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    // const memberPerms = await interaction.member.permissions.toArray();

    // if (!memberPerms.includes('Administrator')) {
    //   return await interaction.reply({ content: "Must be Admin or higher to run this command!", ephemeral: true });
    // }

    const editData = {
      guildId: interaction.guildId,
      guildName: interaction.member.guild.name,
      channelId: interaction.options.getString('channelid') ?? null,
      checkAmount: interaction.options.getInteger('checkamount') ?? null
    }

    const guildSetup = await axios.put(`${config.baseUrl}guild/edit`, editData)

    console.log(guildSetup);

    return await interaction.reply({ content: `Successfully updated your guild!`, ephemeral: true });
  }
}