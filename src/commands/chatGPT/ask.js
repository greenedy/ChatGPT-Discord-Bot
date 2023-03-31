const { ApplicationCommandOptionType } = require('discord.js');
const { Configuration, OpenAIApi }= require('openai');
const { PERSONALITIES }= require('../../utils/constants');

module.exports = {
    name: 'ask',
    description: 'Replies with ChatGPT response',
    //devOnly: Boolean,
    //testOnly: Boolean,
    options: [
        {
            name: 'prompt',
            description: 'Prompt for ChatGPT',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            "name": "personality",
            "description": "The Personality of the bot",
            "type": 3,
            "required": false,
            "choices": [
                {
                    "name": PERSONALITIES.PERSONALITY_FRIENDLY.title,
                    "value": PERSONALITIES.PERSONALITY_FRIENDLY.key
                },
                {
                    "name": PERSONALITIES.PERSONALITY_SARCASTIC.title,
                    "value": PERSONALITIES.PERSONALITY_SARCASTIC.key
                },
                {
                    "name": PERSONALITIES.PERSONALITY_SASSY.title,
                    "value": PERSONALITIES.PERSONALITY_SASSY.key
                }
            ]
        }
    ],

    callback: async (client, interaction) => {
        
        //Get data from interaction
        const prompt = interaction.options.get('prompt').value;
        const personality = (interaction.options.get('personality')) ? PERSONALITIES[interaction.options.get('personality').value] : PERSONALITIES.PERSONALITY_FRIENDLY;
        const userId = interaction.user.id;
        const username = interaction.user.username;

        //Restating the user prompt
        await interaction.reply(`<@${userId}>: ${prompt}`);

        //Pretend to be typing
        await interaction.channel.sendTyping();

        //Create conversation
        //TODO: Get previous conversation messages
        let conversationLog = [{ role: 'system', content: personality.value }];

        conversationLog.push( {
            role: 'user',
            content: prompt,
        });

        //Configure openAI api
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration); 

        //Send request to openAI
        const result = await openai.createChatCompletion({
            model: process.env.OPENAI_MODEL,
            messages: conversationLog,
        });

        //reply with chatGPT response
        await interaction.followUp(result.data.choices[0].message);
    },
};