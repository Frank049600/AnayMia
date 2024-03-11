const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    EVENTS,
    addAnswer } = require('@bot-whatsapp/bot')

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

//                                                  //
//                RECURSOS                          //
//                                                  //
//             Se declaran las variables            //
let datoGlobal = ''
let url = 'C:/Users/Paco/Desktop/AnayMia/';
let RUTE_IMG = url + 'img/'
let db = []
let dataUser
let nombre
let sentimiento
/// Se crea una conexión con la API local
const prompt = require("prompt-sync")({ sigint: true });
// Se requiere la librería fs
const fs = require('node:fs/promises')
//addUser()
getUser()
//const userDBLocal = require(url + 'db/user.json')
//console.log(userDBLocal);
// Inicia con las interacciones del usuario
const flowResponseOk = addKeyword(
    [
        'Si',
        'Si, me gustaría',
        'Si me gustaria',
        'me gustaria',
        'me gustaría',
        'Me gustaría',
        'Me gustaria',
        'Me encantaría',
        'Me encantaria',
        'me encantaría',
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

const flowResponseNo = addKeyword(
    [
        'No',
        'no',
        'En otro momento',
        'en otro momento',
        'No estoy listo',
        'no estoy listo',
        'No creo',
        'no creo',
        'No quiero',
        'no quiero'
    ])
    .addAnswer(
        [
            'No te preocupes.',
            'Puedes platicar con nosotras cuando estés list@'
        ])

const flowBat = addKeyword(
    [
        'Mal',
        'Me siento mal',
        'Me siento pésimo',
        'Me ha ido muy mal',
        'No tan bien',
        'No me encuentro nada bien',
        'Estoy mal',
        'Estoy triste'
    ])
    .addAnswer('No te preocupes, todo mejorará', null,
        async (ctx, { flowDynamic }) => {
            await flowDynamic(`¿Te gustaría platicar con nosotras ${dataUser.nameUser}?`)
        }, [flowResponseOk])

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
    .addAnswer(null, null,
        async (ctx, { flowDynamic }) => {
            await flowDynamic(`Nos da gusto saberlo ${dataUser.nameUser}?`)
        })
    .addAnswer('¿Quieres platicarnos más sobre tu día?', null, [flowResponseOk, flowResponseNo])

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
        'Conoces a alguien que me pueda ayudar',
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

const flujoMessageFinal = addKeyword(EVENTS.ACTION).addAnswer('Nos vemos luego',
    {
        media: RUTE_IMG + "png-clipart-cartoon-animation-cartoon-farewell-party-cartoon-character-child.png"
    })

const DESPEDIDA = addKeyword(['adios', 'Adiós', 'Adios'])
    .addAnswer([
        '¿De verdad ya no quieres platicar con nosotras? (No respondas nada si tu respuesta es "SI")'],
        {
            capture: true,
            idle: 10000
        }, // idle: 10000 = 10 segundos
        async (ctx, { gotoFlow, inRef }) => {
            if (ctx?.idleFallBack) {
                return gotoFlow(flujoMessageFinal)
            }
        }
    )

//FUNCIÓN fullBack para capturar una dirección de correo electrónico
const flowString = addKeyword(
    [
        'necesito mas información',
        'necesito mas informacion',
        'Necesito mas información',
        'Necesito mas informacion'
    ])
    .addAnswer('Nos podrías pasar tu email para compartirte mayor información',
        {
            capture: true
        },
        async (ctx, { fallBack }) => {
            if (!ctx.body.includes('@')) {
                return fallBack()
            } else {

            }
        })

const flowPrincipal = addKeyword(
    [
        'Que tal',
        'hola,hola',
        'Hey',
        'Hola',
        'hola',
        'alo',
        'Alo',
        'Que hay'
    ])
    .addAnswer(
        [
            '¡Hola!, somos Ana&Mia 😁',
            'Que gusto saludarte'
        ]
    )
    .addAnswer(['Creo que aun no nos conocemos 😧', '¿Cuál es tu nombre?'],
        {
            capture: true
        },
        async (ctx, { flowDynamic }) => {
            dataUser = {
                from: ctx.from,
                nameUser: ctx.body
            }
            userDB.append(dataUser)
            console.log(userDB);
            return await flowDynamic(`Encantadas en conocerte ${dataUser.nameUser}`)
        }
    )
    .addAnswer('¿Cómo te sientes el día de hoy?',
        {
            capture: true
        },
        async (ctx, { flowDynamic }) => {
            sentimiento = ctx.body
        }, [flowBat, flowGood])

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    })
    const adapterFlow = createFlow([flowPrincipal, flowString])
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

function getUser() {
    const userDB = require(url + 'db/user.json')
    console.log(userDB);
    //fs.readFile('./db/user.json')
    //    .then(datos => {
    //        console.log(JSON.parse(datos.toString()));
    //    })
    //    .catch(error => {
    //        console.log(error);
    //    })
}

function addUser() {
    let response
    // Se elimina el archivo anterior
    fs.unlink('./db/user.json')
    // Se crea el nuevo archivo con la nueva información
    fs.writeFile('./db/user.json', '{ "from": 52464148526, "userName": "Moises" }', error => {
        if (error) {
            console.log(error)
        }
        else {
            console.log('Creado con éxito')
        }
    })
}