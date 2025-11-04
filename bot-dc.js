const { Client, Collection, WebhookClient } = require("discord.js");
const discordModals = require("discord-modals");
require("dotenv").config();
require("./Mysql");

const client = new Client({
  intents: 32767,
});
module.exports = client;
require("./Core")(client);
discordModals(client);

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.config = process.env;

const hook = new WebhookClient({ id: process.env.OWNER_ID, token: process.env.TOKEN_BOT });

// Fungsi untuk mengirimkan log kesalahan
const logError = (error) => {
  hook.send(`\`\`\`js\n${error.stack}\`\`\``);
};

// Menangani berbagai jenis kesalahan
process.on('unhandledRejection', logError);
process.on('uncaughtException', logError);
process.on('uncaughtExceptionMonitor', logError);
process.on('beforeExit', (code) => hook.send(`\`\`\`js\n${code}\`\`\``));
process.on('exit', (code) => hook.send(`\`\`\`js\n${code}\`\`\``));

// Menangani jika terjadi multiple resolves
process.on('multipleResolves', (type, promise, reason) => {
  console.warn(`Multiple resolves terdeteksi: ${type}`, reason);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.content === `${client.config.PREFIX_BOT}sdbot`) {
        message.channel.send('Mematikan bot...').then(() => {
            client.destroy().then(() => {
                process.exit(0);
                console.log('Bot telah dimatikan.');
            }).catch(error => {
                console.error('Gagal mematikan bot:', error);
                process.exit(1);
            });
        });
    }
});

client.login(client.config.TOKEN_BOT).catch(error => {
    console.error('Gagal login bot:', error);
});
