const { ApplicationCommandOptionType } = require('discord.js');
const { Configuration, OpenAIApi }= require('openai');

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
        }
    ],

    callback: async (client, interaction) => {
        
        const prompt = interaction.options.get('prompt').value;
        const userId = interaction.user.id;

        let conversationLog = [{ role: 'system', content: "You are a friendly sarcastic chatbot." }];

        conversationLog.push( {
            role: 'user',
            content: prompt,
        });

        await interaction.deferReply(`asking chatgpt`);

        const configuration = new Configuration({
            apiKey: process.env.API_KEY,
        });
        const openai = new OpenAIApi(configuration); 

        //Send request to openAI
        const result = await openai.createChatCompletion({
            model: process.env.MODEL,
            messages: conversationLog,
        });

        //reply with chatGPT response
        await interaction.editReply(result.data.choices[0].message);
    },
};