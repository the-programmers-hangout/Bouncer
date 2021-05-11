require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;

  const allowedInvites = process.env.INVITES.split(',');

  let content = message.content;
  allowedInvites.forEach((invite) => {
    content = content.replace(invite, '');
  });


  if (!message.member.hasPermission('MANAGE_GUILD')) { 
    if (regex.exec(content)) {
      await message.delete();

      const alertChannel = client.channels.cache.get(process.env.ALERT_CHAN_ID);
      alertChannel
        .send(`**<@${message.author.id}> sent an invite in <#${message.channel.id}>**\nMessage content:`);

      alertChannel.send(message.content);

      try {
        await message.author
          .send(`Don't send invite links on The Programmer's Hangout. https://tenor.com/t42s.gif`)
      } catch (exception) {
        console.log(exception);
      }
    }
} 
});

client.login(process.env.TOKEN);
