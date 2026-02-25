const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes,
  InteractionType,
  PermissionFlagsBits
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ===== Slash команда =====
const commands = [
  new SlashCommandBuilder()
    .setName('give')
    .setDescription('Выдать роль по SteamID')
    .addStringOption(option =>
      option.setName('steamid')
        .setDescription('SteamID игрока')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Slash command registered');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'give') {
    const steamid = interaction.options.getString('steamid');

    await interaction.reply({
      content: `SteamID: ${steamid}\nНапиши название роли и время (пример: VIP 7d)`,
      ephemeral: true
    });
  }
});

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.login(TOKEN);
