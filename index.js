require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionFlagsBits,
} = require("discord.js");

const client = new Client({
  intents: Object.keys(GatewayIntentBits),
  partials: Object.keys(Partials),
});

const regex =
  /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  handlePotentialInvite(message);
});

async function handlePotentialInvite(message) {
  if (message.author.bot) return;

  const allowedInvites = process.env.INVITES.split(",");

  let content = message.content;
  allowedInvites.forEach((invite) => {
    content = content.replace(invite, "");
  });

  if (message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    if (regex.exec(content)) {
      await message.delete();

      const alertChannel = client.channels.cache.get(process.env.ALERT_CHAN_ID);
      alertChannel.send(
        `**<@${message.author.id}> sent an invite in <#${message.channel.id}>**\nMessage content:`
      );

      alertChannel.send(escapeInvites(message.content));

      try {
        await message.author.send(
          `Don't send invite links on The Programmer's Hangout.`
        );
      } catch (exception) {
        console.log(exception);
      }
    }
  }
}

function escapeInvites(msg) {
  return msg.replace(regex, (match) => {
    return `<${match}>`;
  });
}

client.login(process.env.TOKEN);
