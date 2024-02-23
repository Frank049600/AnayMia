const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
//const { createBotDialog } = require('@bot-whatsapp/contexts/dialogflow');
/**
 * Declaramos las conexiones de Mongo
 */
const MONGO_DB_URI = 'mongodb+srv://anaymiachatbot:123456anaymia@projectanaymia.yiho2sz.mongodb.net/?retryWrites=true&w=majority'
const MONGO_DB_NAME = 'anaymiaDB'

const botondesentimiento= addKeyword('¿Cómo te sientes ?').addAnswer('Elige tu estado de animo', {
    buttons: [{ body: 'Bien :)' }, { body: 'Mal :(' }, { body: 'Triste :((' }, { body: 'Muy Feliz :)' }, { body: 'No muy bien :Z' }],
});

const flowgetName = addKeyword(['hola'])
        .addAnswer(
            '¿Cual es tu nombre?',
            {
                capture: true,
            },
            async (ctx, { flowDynamic, state }) => {
                await state.update({ name: ctx.body })
                await flowDynamic(`Gracias por tu nombre!, ${ctx.body} ahora podemos conocernos aun más nosotras somos Ana & Mia`)
            }
        )
        .addAnswer(
            '¿Cual es tu edad?',
            {
                capture: true,
            },
            async (ctx, { flowDynamic, state }) => {
                await state.update({ age: ctx.body })
                const myState = state.getMyState()
                await flowDynamic(`Gracias por tu edad! ${myState.name}`)
            }
        )

// Inicia con las interacciones del usuario
const flowResponseOk = addKeyword(
    [
        'Si',
        'Si, me gustaría',
        'Claro',
        'Con gusto',
        'Simon'
    ])
    .addAnswer(
        [
            'Cuéntanos sobre tu día.',
            'Somos todo oídos'
        ]);

const flowBat = addKeyword(
    [
        'Mal',
        'Me siento pésimo',
        'Me ha ido muy mal',
        'No tan bien'
    ])
    .addAnswer('Todo estará bien, ¿te gustaría platicarlo?', {
        delay: 1500
    }, null, flowResponseOk);

const flowGood = addKeyword(
    [
        'Bien',
        'Grandioso',
        'Muy bien',
        'Genial',
        'Chido'
    ])
    .addAnswer('Nos da gusto saberlo.')
    .addAnswer('¿Quieres platicarnos más sobre tu día?', {
        delay: 1500
    }, null, flowResponseOk);

const flowAutoAtact = addKeyword(
    [
        'Nadie me querrás así',
        'Estoy obeso',
        'Estoy obesa',
        'Soy asquerosa',
        'Soy asqueroso',
        'Me veo mal',
        'Estoy gordo',
        'Estoy gorda'
    ])
    .addAnswer(
        [
            '¡No creo que sea verdad!',
            'Viniste a este mundo a ser feliz, no a buscar la perfección en tu cuerpo, eso solo puede conducirte a sufrir.'
        ])

const flowPrincipal = addKeyword(
    [
        'Que tal',
        'hola,hola',
        'Hey',
        'Hola',
        'Que hay'
    ])
    .addAnswer(
        [
            '¡Hola!, que tal',
            'Que gusto saludarte'
        ])
    .addAnswer('¿Cómo te encuentras el día de hoy?', {
        delay: 1500
    }, null, [flowBat, flowGood]);

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    })
    const adapterFlow = createFlow([flowAutoAtact, flowgetName])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    //createBotDialog({
    //    provider: adapterProvider,
    //    database: adapterDB,
    //});
    QRPortalWeb()
}

main()