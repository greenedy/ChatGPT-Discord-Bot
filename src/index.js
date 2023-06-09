require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi }= require('openai');
const eventHandler = require('./handlers/eventHandler');

//Create bot
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

eventHandler(client);

//OpenAI connection
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration); 

client.on('messageCreate', async (message) => {
    if(message.author.bot) return; //Ignore bot messages
    if(message.channel.id !== process.env.CHANNEL_ID) return; //Ignore messages outside of channel
    if(message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: "You are a friendly sarcastic chatbot." }];

    //Pretend to be typing
    await message.channel.sendTyping();

    //Get previous messages in conversation
    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (msg.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: msg.content,
        });
    });

    conversationLog.push( {
        role: 'user',
        content: message.content,
    });

    //Send request to openAI
    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    });

    //reply with chatGPT response
    message.reply(result.data.choices[0].message);
});

client.login(process.env.DISCORD_TOKEN);