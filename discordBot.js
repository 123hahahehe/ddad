const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');
const http = require('http');

// Create a new Discord client
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
});

// Function to replace example.com emails with random providers
function replaceEmailProviders(email) {
    const emailProviders = ['@yahoo.com', '@gmail.com', '@myyahoo.com', '@hotmail.com'];
    const randomProvider = emailProviders[Math.floor(Math.random() * emailProviders.length)];
    return email.replace(/@example\.com$/, randomProvider);
}

// Random phrases for mentioning the user's action
const actions = [
    'runs',
    'owns',
    'manages',
    'controls',
    'dominates',
    'leads',
    'commands',
    'presides over',
    'directs',
    'oversees'
];

// Random messages and gifs
const randomMessages = [
    'shouldve used a vpn',
    'easy target',
    'pleb doxxed',
    'gg larp'
];

const kawaiiExpressions = [
    'meow',
    '^-^',
    'nyaaaaa',
    'owo',
    'uhu'
];

const randomGifs = [
    'https://c.tenor.com/I9p05FAVOFQAAAAd/tenor.gif',
    'https://c.tenor.com/99kNkafFjT8AAAAd/tenor.gif',
    'https://c.tenor.com/lUbT0ff2HNYAAAAC/tenor.gif',
    'https://c.tenor.com/vEL_t2HUvvoAAAAd/tenor.gif',
    'https://c.tenor.com/ucp9cSGNT0UAAAAd/tenor.gif'
];

// Function to randomly select an action phrase
function getRandomAction() {
    return `${actions[Math.floor(Math.random() * actions.length)]} ${kawaiiExpressions[Math.floor(Math.random() * kawaiiExpressions.length)]}`;
}

// Function to randomly select a message
function getRandomMessage() {
    return `${randomMessages[Math.floor(Math.random() * randomMessages.length)]} ${kawaiiExpressions[Math.floor(Math.random() * kawaiiExpressions.length)]}`;
}

// Function to randomly select a gif
function getRandomGif() {
    return randomGifs[Math.floor(Math.random() * randomGifs.length)];
}

// Event listener for when the bot is ready
client.once('ready', () => {
    console.log('Bot is ready!');
});

// Event listener for when a message is received
client.on('messageCreate', async message => {
    if (message.content.startsWith('!dox')) {
        try {
            const mentionedUser = message.mentions.users.first();
            const response = await axios.get('https://randomuser.me/api/');
            const userData = response.data.results[0];
            userData.email = replaceEmailProviders(userData.email);
            const customName = `${userData.name.first} ${userData.name.last}`;

            const embed = new MessageEmbed()
                .setTitle('User Dox')
                .setColor('#0099ff')
                .setThumbnail(mentionedUser ? mentionedUser.displayAvatarURL({ dynamic: true }) : userData.picture.large)
                .addFields(
                    { name: '**Name**', value: `**${customName}**`, inline: true },
                    { name: '**Gender**', value: `**${userData.gender}**`, inline: true },
                    { name: '**Location**', value: `**${userData.location.city}, ${userData.location.country}**`, inline: true },
                    { name: '**Email**', value: `**${userData.email}**`, inline: true },
                    { name: '**Phone**', value: `**${userData.phone}**`, inline: true },
                    { name: '**DOB**', value: `**${userData.dob.date.slice(0, 10)}**`, inline: true },
                );

            if (mentionedUser) {
                message.channel.send({ embeds: [embed] }).then(() => {
                    message.channel.send(`${message.author} ${getRandomAction()}`).then(() => {
                        message.channel.send(getRandomMessage()).then(() => {
                            message.channel.send(getRandomGif());
                        });
                    });
                });
            } else {
                message.channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error:', error);
            message.channel.send('Error fetching user data.');
        }
    }
});

// Log in to Discord with your app's token
client.login(process.env.DISCORD_BOT_TOKEN);

// Keep the bot alive on Replit
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is running nya!');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
