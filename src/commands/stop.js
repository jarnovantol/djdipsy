module.exports = {
	name: 'stop',
	description: 'Stop command.',
	cooldown: 5,
	execute(message) {
		const { voiceChannel } = message.member;
		if (!voiceChannel) return message.channel.send('Je moet in een spraakkanaal zitten om muziek af te spelen!');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Er is geen nummer die ik kan stoppen.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
	}
};
