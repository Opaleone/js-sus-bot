const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const sleep = require('./utils/sleep');

const suspicious = ['cock', 'fuck me', 'hard', 'chub', 'daddy', 'horny', 'sexy', 'thicc', 'papi', 'head',
'mami', 'mommy', 'trans', 'cum', 'coom', 'whore', 'bitch', 'erect', 'pipe', 'flaccid',
'masturbate', 'beat my meat', 'splooge', 'fat cheeks', 'bussy', 'sploosh', 'foreskin'];

const susResponses = ['ayoooo?!?!', 'Pause', 'Wut?', 'Wanna run that by me again?', 'no shot', 'HUH?!?!', "Ain't no way",
'Yo wuuuuuuuuut', 'No maidens??', "No thanks, I'm a vegetarian."];

// let randomNum = Math.floor(Math.random() * 5);
// let cnt = 0;

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions
  ] 
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, './src/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, './src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('messageCreate', async (message) => {
	// does nothing if message creator is bot
	if (message.author.id === client.user.id) return;

  const msg = message.content.toLowerCase();
  const msgArr = msg.split(' ');

	// Checks if word is sus and responds accordingly
  for (const word of msgArr) {
    if(suspicious.includes(word)) {
      await sleep(5000);
      await message.reply(susResponses[Math.floor(Math.random() * susResponses.length)]);
    }
  }

	// command to MOCK someone
	// if (message.author.username === "// username") {
	// 	if (cnt === randomNum) {
	// 		let mock = '';
	// 		const msgArr = msg.split('');

	// 		for (let i = 0; i < msgArr.length; i++) {
	// 			if (i % 2 === 0) {
	// 				mock += msgArr[i].toLowerCase();
	// 			} else {
	// 				mock += msgArr[i].toUpperCase();
	// 			}
	// 		}

	// 		randomNum = Math.floor(Math.random() * 5);
	// 		cnt = -1;

	// 		sleep(1000);
	// 		await message.reply(mock);

	// 		// Reply should be:
	// 				// e.x. What is this?
	// 				// Reply: wHaT Is tHiS?
	// 	}
	// 	cnt++;
	// }
});

client.login(token);
