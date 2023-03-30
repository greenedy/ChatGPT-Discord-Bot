const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Pong!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    //options: Object[],
    //deleted: Boolean,
    //permissionsRequired:[PermissionFlagsBits.Administrator],
    //botPermissions:[PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    },
};