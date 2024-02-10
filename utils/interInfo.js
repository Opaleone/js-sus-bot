module.exports = {
  interInfo: (interaction) => {
    const interInfo = {
      uid: interaction.user.id,
      gid: interaction.guildId,
      username: interaction.user.username,
      guildname: interaction.member.guild.name,
    }
    return interInfo;
  }
}