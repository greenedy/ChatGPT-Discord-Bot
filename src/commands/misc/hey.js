module.exports = {
    name: 'hey',
    description: 'Replies with hey!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //options: Object[],

    callback: (client, interaction) => {
        interaction.reply('hey!');
    },
};