const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    EVENTS } = require('@bot-whatsapp/bot')
 
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
//const { createBotDialog } = require('@bot-whatsapp/contexts/dialogflow')
/**
 * Declaramos las conexiones de Mongo
 */
const MONGO_DB_URI = 'mongodb+srv://anaymiachatbot:123456anaymia@projectanaymia.yiho2sz.mongodb.net/?retryWrites=true&w=majority'
const MONGO_DB_NAME = 'anaymiaDB'
 
const botondesentimiento = addKeyword('¿Cómo te sientes ?').addAnswer('Elige tu estado de animo', {
    buttons: [{ body: 'Bien :)' }, { body: 'Mal :(' }, { body: 'Triste :((' }, { body: 'Muy Feliz :)' }, { body: 'No muy bien :Z' }],
})
 
// Inicia con las interacciones del usuario
const flowResponseOk = addKeyword(
    [
        'Si',
        'Si, me gustaría',
        'Claro',
        'Con gusto',
        'Simon',
        'Por supuesto',
        'Si, claro',
        'ok'
    ])
    .addAnswer(
        [
            'Cuéntanos sobre tu día.',
            'Somos todo oídos'
        ])
 
const flowBat = addKeyword(
    [
        'Mal',
        'pior',
        'pesimo',
        'Me siento mal',
        'Me siento pésimo',
        'Me ha ido muy mal',
        'No tan bien',
        'No me encuentro nada bien',
        'Estoy mal',
        'Estoy triste'
    ])
    .addAnswer(['No te preocupes, todo mejorará', '¿Te gustaría platicar con nosotras?'], {
        delay: 1500
    }, null, flowResponseOk)
 
const flowGood = addKeyword(
    [
        'Bien',
        'Grandioso',
        'Muy bien',
        'Genial',
        'Chido',
        'Me siento bien',
        'Es un buen dia',
        'Me encuentro  bien',
        'Estoy bien',
        'Estoy feliz'
    ])
    .addAnswer('Nos da gusto saberlo.')
    .addAnswer('¿Quieres platicarnos más sobre tu día?', {
        delay: 1500
    }, null, flowResponseOk)
 
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
 
//CREACIÓN DE FLUJO " ORIENTACIÓN CON PROFESIONALES"
const flowOrientacion = addKeyword(
    [
        'No es suficiente tu ayuda',
        'Necesito mayor apoyo',
        'Necesito acudir con un profesional',
        'Ya no puedo mas con esto',
        'Creo que necesito mas ayuda',
        'Me podrías ayudar mas',
        'Necesito mas apoyo',
        'Conoces a alguien mas que me pueda ayudar'
    ])
    .addAnswer([
        'No te preocupes te proporcionaremos una lista con los contactos de profesionales que te podran brindar un mayor apoyo. Acude con ellos cuanto antes. RECUERDA NO ESTAS SOL@.'])
    .addAnswer([
        '(LISTA DE CONTACTOS)'
    ])
 
//CREACIÓN DE FLUJO "PETICIÓN DE AYUDA"
const peticionde_ayuda = addKeyword(
    [
        '¿Que debo hacer?',
        'Tengo dudas',
        'Estoy intranquila',
        'Quiero platicar'
    ])
    .addAnswer([
        'No te preocupes estamos para ayudarte, recuerda que somos tus amigas y estamos siempre para ti. Vamos a platicar va.'
    ])
 
// CREACIÓN DE FLUJO "DESPEDIDA"
const DESPEDIDA = addKeyword(
    [
        'Adiós',
        'Bye',
        'Hasta luego',
        'Nos vemos'
    ])
    .addAnswer(
        [
            'Nos vemos pronto.'
        ])
    .addAnswer(
        [
            'Fue un gusto saludarte :)'
        ])
 
// PREGUNTAS
const FLOPregunta = addKeyword(
    [
        'Quiero desahogarme',
        'Necesito platicar con alguien',
        'Me gustaría hablar de mi situación',
        'Quisiera hablar de como me siento'
    ])
    .addAnswer('Me gustaría escucharte, cuéntame, ¿cómo te sientes?')
// Flujo - confianza
const flowConfianza = addKeyword(
    [
        'No me acuses',
        '¿No le avisaras a nadie?',
        'Esto es secreto',
        'No le comentes a nadie',
        '¿Es seguro hablar contigo?',
        '¿Es seguro hablar con ustedes?',
        'No le digas a nadie',
        '¿Le contaras a otra persona sobre esto?',
        '¿Le contaran a otra persona sobre esto?',
        '¿Alguien más se enterara de lo que cuento?'
    ])
    .addAnswer(['No te preocupes no le contare a nadie', 'Quedará entre nosotros'])
 
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
 
   
const flujoFinal = addKeyword(EVENTS.ACTION).addAnswer('Nos vemos luego', 
{
    media: "C:/Users/LAB04-08/Desktop/AnayMia/img/png-clipart-cartoon-animation-cartoon-farewell-party-cartoon-character-child.png"
})
 
const flujoPrincipalll = addKeyword(['adios','Adiós','Adios'])
    .addAnswer([
       '¿De verdad ya no quieres platicar con nosotras? (No respondas nada si tu respuesta es "SI")'],
        {
            capture: true,
            idle: 10000
        }, // idle: 10000 = 10 segundos
        async (ctx, { gotoFlow, inRef }) => {
            if (ctx?.idleFallBack) {
                return gotoFlow(flujoFinal)
            }
        }
    )
 
 
 
//BOTONES DE SATISFACCIÓN EN CONVERSACIÓN
 
    const flowString = addKeyword('eso es todo').addAnswer('ANTES DE IRTE PUEDES DECIRNOS COMO TE SIENTES DESPUES DE PLATICAR CON NOSOTRAS', {
        buttons: [{ body: 'MUY BIEN' }, { body: 'MAL' }, { body: 'NO ME AYUDO' }],
    })
 
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
    .addAnswer('Creo que aun no nos conocemos, ¿Cuál es tu nombre?', {
        capture: true,
        delay: 1500
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
 
const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    })
    const adapterFlow = createFlow([flowAutoAtact,flujoFinal,flujoPrincipalll])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    //createBotDialog({
    //    provider: adapterProvider,
    //    database: adapterDB,
    //})
    QRPortalWeb()
}
 
main()