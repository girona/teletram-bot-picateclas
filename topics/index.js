const { MenuTemplate, MenuMiddleware, replyMenuToContext } = require('telegraf-inline-menu')
const TelegrafStatelessQuestion = require('telegraf-stateless-question');

const menu = new MenuTemplate(() => 'Topics')
const topics = (bot) => {

    let topics = [];
    
    // Add topic
    
    const addTopic = new TelegrafStatelessQuestion('add_topic', async (ctx) => {
        const answer = ctx.message.text
        topics.push(answer);
        await ctx.reply(`Topic ${answer} afegit!`)
    
        return false;
    })
    bot.use(addTopic.middleware())
    menu.interact('Add topic', 'add_topic', {
        do: async (ctx) => {
            const text = 'Quin topic vols afegir?'
            await addTopic.replyWithMarkdown(ctx, text)
            return true;
        }
    })
    
    // Delete topic
    
    const deleteTopic = new TelegrafStatelessQuestion('delete_topic', async (ctx) => {
        const answer = ctx.message.text
        if(topics.includes(answer)) {
            topics.splice(topics.indexOf(answer))
            await ctx.reply(`Topic ${answer} eliminat`)
        }
        else await ctx.reply("Aquest topic no existeix!")
        
        return false;
    })
    bot.use(deleteTopic.middleware())
    menu.interact('Delete topic', 'delete_topic', {
        do: async (ctx) => {
            const text = 'Quin topic vols eliminar?'
            await deleteTopic.replyWithMarkdown(ctx, text)
            return true;
        }
    })
    
    // List topics
    
    menu.interact('List topic', 'list-topic', {
        hide: () => false,
        do: async ctx => {
            await ctx.reply(topics)
            return false
        }
    })
    
    const menuMiddleware = new MenuMiddleware('/', menu)
    
    bot.command('topics', async ctx => menuMiddleware.replyToContext(ctx))
    bot.use(menuMiddleware.middleware())    
}

module.exports = topics;