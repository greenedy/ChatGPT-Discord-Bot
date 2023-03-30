require('dotenv').config();
const { REST, Routes, Appl, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'hey',
        description:'Replies with hey!',
    },
    {
        name: 'ask',
        description:'Replies with ChatGPT response',
        options: [
            {
                name: 'prompt',
                description: 'Prompt for ChatGPT',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commmands');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands}
        )

        console.log('Slash commands registered');
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}) ();