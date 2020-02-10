require('dotenv').config();
const { readdirSync } = require('fs');
const { join } = require('path');
const MusicClient = require('./struct/Client.js');
const { Collection } = require('discord.js');
const client = new MusicClient({ prefix: process.env.DISCORD_PREFIX });

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(join(__dirname, 'commands', `${file}`));
	client.commands.set(command.name, command);
}

client.on("ready", async () => {
	console.log(`${bot.user.username} is online op ${bot.guilds.size} servers!`);
	bot.user.setActivity("zijn eigen pokoes", {type: "LISTENING"});
});

client.once('ready', () => console.log('READY!'));
client.on('message', message => {
	if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;
	const args = message.content.slice(client.config.prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	if (command.guildOnly && message.channel.type !== 'text') return message.reply('Ik kan dat command niet uitvoeren in privéberichten!');
	if (command.args && !args.length) {
		let reply = `Het command klopt niet, ${message.author}!`;
		if (command.usage) reply += `\nDe juiste manier van gebruiken is: \`${client.config.prefix}${command.name} ${command.usage}\``;
		return message.channel.send(reply);
	}
	if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new Collection());
	}
	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Wacht ${timeLeft.toFixed(1)} seconden voordat je het \`${command.name}\` command opnieuw gebruikt.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Er is iets misgegaan tijdens het uitvoeren van het command!');
	}
});

client.login(process.env.token);
