module.exports = {
	name: 'volume',
	description: 'Volume command.',
	cooldown: 5,
	execute(message, args) {
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('Je moet in een spraakkanaal zitten om muziek af te spelen');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Er is niks om af te spelen');
		if (!args[0]) return message.channel.send(`Het volume op dit moment: **${serverQueue.volume}**`);
		serverQueue.volume = args[0]; // eslint-disable-line
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(`Ik heb het volume gezet naar: **${args[0]}**`);
	}
};
