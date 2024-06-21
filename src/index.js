require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

async function loadSlashCommands(bot) {
  // Votre logique de chargement des commandes slash
  // Exemple : await bot.application.commands.set(commandsArray);
}

let statuses = [
  {
    name: 'compte le nombre de membres',
    type: ActivityType.Watching,
  },
  {
    name: 'compte le nombre de serveurs',
    type: ActivityType.Watching,
  },
  {
    name: 'et protège les serveurs🔒',
    type: ActivityType.Watching,
  },
];

let currentStatusIndex = 0;

client.on('ready', async (c) => {
  console.log(`✅ ${c.user.tag} is online.`);

  // Charger les commandes slash
  await loadSlashCommands(client);
  console.log(`Le bot est utilisé sur ${client.guilds.cache.size} serveur(s) !`);

  // Fonction pour mettre à jour les compteurs
  const updateCounters = async () => {
    const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const totalServers = client.guilds.cache.size;
    statuses[0].name = `${totalMembers} membres 💪`;
    statuses[1].name = `${totalServers} serveurs 🏁`;
  };

  // Initial update
  await updateCounters();

  // Mettre à jour les compteurs toutes les minutes
  setInterval(updateCounters, 60000); // 1 minute interval

  // Changer le statut toutes les 30 secondes
  setInterval(async () => {
    currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
    let status = statuses[currentStatusIndex];

    try {
      await client.user.setActivity(status.name, { type: status.type });
    } catch (error) {
      await client.user.setActivity('Aucun serveur 🔴', { type: ActivityType.Watching });
    }
  }, 30000); // 30 seconds interval
});

client.login(process.env.TOKEN);
