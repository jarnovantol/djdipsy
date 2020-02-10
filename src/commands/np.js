module.exports = {
	name: 'np',
	description: 'Now playing command.',
	cooldown: 5,
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Er is niks om af te spelen.');
		return message.channel.send(`🎶 Nu aan het afspelen: **${serverQueue.songs[0].title}**`);
	}
};
