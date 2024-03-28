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

//                                                  //
//                RECURSOS                          //
//                                                  //
//             Se declaran las variables            //
let url = 'C:/Users/Paco/Desktop/AnayMia/';
let RUTE_IMG = url + 'img/'
let nombre
// Se requiere la librería fs
const fs = require('node:fs/promises')
const userDB = require(url + 'db/users.json')
const keywordLib = require(url + 'lib/keywords.json')
const answerLib = require(url + 'lib/answers.json')

const botondesentimiento = addKeyword('¿Cómo te sientes ?').addAnswer('Elige tu estado de animo', {
    buttons: [{ body: 'Bien :)' }, { body: 'Mal :(' }, { body: 'Triste :((' }, { body: 'Muy Feliz :)' }, { body: 'No muy bien :Z' }],
})

const flowDespedida = addKeyword(keywordLib.flowDespedida)
    .addAnswer(answerLib.flowDespedida,
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

const flowThanks = addKeyword(keywordLib.flowThanks)
    .addAnswer('Quiérete, ámate, siéntete merecedor de todo lo bello del mundo desde el espíritu, no desde tu cuerpo nada más. Si aprendes a amar tu interior entenderás que tu exterior es perfecto como está.', null,
        async (ctx, { flowDynamic }) => {
            await flowDynamic(`${nombre} viniste a este mundo a ser feliz, no a buscar la perfección en tu cuerpo, eso solo puede conducirte a sufrir.`)
        })

// Inicia con las interacciones del usuario
const flowResponseOk = addKeyword(keywordLib.flowResponseOk)
    .addAnswer(
        [
            'Maravilloso, no te contengas.',
            'Somos todo oídos 🙃'
        ], null, null, [flowDespedida])

const flowResponseNo = addKeyword(keywordLib.flowResponseNo)
    .addAnswer('Respetamos tu decisión', null,
        async (ctx, { flowDynamic }) => {
            await flowDynamic(`Puedes platicarnos cuando tu lo decidas ${nombre}`)
        })
    .addAnswer('Recuerda que estamos para ti, siempre que nos necesites 😉', null, null, [flowThanks, flowDespedida])

const flowBat = addKeyword(keywordLib.flowBat)
    .addAnswer('No te preocupes', null,
        async (_, { flowDynamic }) => {
            return await flowDynamic(`Todo mejorará ${nombre} 😇`)
        })
    .addAnswer('¿Te gustaría platicar con nosotras 🙃?',
        {
            capture: true
        }, null, [flowResponseOk, flowResponseNo, flowDespedida])

const flowGood = addKeyword(keywordLib.flowGood)
    .addAnswer('Que alegría 😁', null,
        async (ctx, { flowDynamic }) => {
            await flowDynamic(`Nos da gusto saberlo ${nombre}`)
        })
    .addAnswer('Te gustaría platicarnos más sobre tu día?',
        {
            capture: true
        }, null, [flowResponseOk, flowResponseNo, flowDespedida])

const flowAutoAtact = addKeyword(keywordLib.flowAutoAtact)
    .addAnswer(
        [
            '¡No creo que sea verdad!',
            'Viniste a este mundo a ser feliz, no a buscar la perfección en tu cuerpo, eso solo puede conducirte a sufrir.'
        ])

//CREACIÓN DE FLUJO " ORIENTACIÓN CON PROFESIONALES"
const flowOrientacion = addKeyword(keywordLib.flowOrientacion)
    .addAnswer([
        'No te preocupes te proporcionaremos una lista con los contactos de profesionales que te podran brindar un mayor apoyo. Acude con ellos cuanto antes. RECUERDA NO ESTAS SOL@.'])
    .addAnswer([
        '(LISTA DE CONTACTOS)'
    ])

//CREACIÓN DE FLUJO "PETICIÓN DE AYUDA"
const peticion_de_ayuda = addKeyword(keywordLib.peticion_de_ayuda)
    .addAnswer('No te preocupes estamos para ayudarte, recuerda que somos tus amigas y estamos siempre para ti. Vamos a platicar va.')

// PREGUNTAS
const flowPregunta = addKeyword(keywordLib.flowPregunta)
    .addAnswer('Me gustaría escucharte, cuéntame, ¿cómo te sientes?')
// Flujo - confianza
const flowConfianza = addKeyword(keywordLib.flowConfianza)
    .addAnswer(['No te preocupes no le contare a nadie', 'Quedará entre nosotros'])

const flujoMessageFinal = addKeyword(EVENTS.ACTION).addAnswer(
    [
        '¿Platicamos 🙃?',
        'Hace tiempo que no sabemos de ti'
    ],
    {
        media: RUTE_IMG + "png-clipart-cartoon-animation-cartoon-farewell-party-cartoon-character-child.png"
    })

//FUNCIÓN fullBack para capturar una dirección de correo electrónico
const flowEmail = addKeyword(keywordLib.flowEmail)
    .addAnswer('Nos podrías pasar tu email para compartirte mayor información',
        {
            capture: true
        },
        async (ctx, { fallBack, flowDynamic }) => {
            if (!ctx.body.includes('@')) {
                return fallBack()
            } else {
                await flowDynamic('Gracias, en unos momento te mandamos más información')
            }
        })

const flowRemember = addKeyword('evento')
    .addAnswer('Que gusto 🤗', null,
        async (ctx, { flowDynamic }) => {
            nombre = getUser(ctx.from)
            await flowDynamic(`¿Cómo has estado ${nombre}?`)
        })
    .addAction({ capture: true },
        async (ctx, { gotoFlow }) => {
            console.log(ctx.body);
            if (keywordLib.flowGood.includes(ctx.body)) {
                console.log('sista');
            } else if (keywordLib.flowBat.includes(ctx.body)) {
                return gotoFlow(flowBat);
            }
        })

const flowKnow = addKeyword(EVENTS.ACTION)
    .addAnswer(answerLib.flowKnow,
        {
            capture: true
        },
        async (ctx, { flowDynamic }) => {
            console.log(ctx.body);
            addUser(ctx.from, ctx.body);
            nombre = getUser(ctx.from)
            return await flowDynamic(`Encantadas en conocerte ${nombre} 🤗`)
        })
    .addAnswer('¿Cómo te sientes el día de hoy?',
        {
            capture: true
        },
        async (ctx, { flowDynamic }) => {
            sentimiento = ctx.body
        }, [flowBat, flowGood])

const flowGetName = addKeyword(keywordLib.flowGetName)
    .addAnswer('🤗', null,
        async (ctx, { flowDynamic }) => {
            let youName = getUser(ctx.from)
            return await flowDynamic(`Tu nombre es ${youName}`)
        })

const flowPrincipal = addKeyword(keywordLib.flowPrincipal)
    .addAnswer(['¡Hola! 🤗', 'Creo que aun no nos conocemos 😧'])
    .addAnswer('¿Cómo te llamas?',
        {
            capture: true,
            delay: 500
        },
        async (ctx, { fallBack, flowDynamic }) => {
            if (requestInclude(ctx.body)) {
                return fallBack()
            } else {
                addUser(ctx.from, ctx.body);
                nombre = getUser(ctx.from);
                await flowDynamic(`Encantadas en conocerte ${nombre} 🤗`)
            }
        })
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
    const adapterFlow = createFlow(
        [
            flowPrincipal,
            flowEmail,
            flowDespedida,
            flowConfianza,
            flowPregunta,
            peticion_de_ayuda,
            flowOrientacion,
            flowAutoAtact,
            flowGetName,
            flowRemember
        ])
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

// Función que consume la API local, donde se guardar los usuarios
function getUser(params) {
    let arrayFrom = []
    for (let i = 0; i < userDB.length; i++) {
        if (userDB[i].from == params) {
            arrayFrom.push(userDB[i].userName)
        }
    }
    if (arrayFrom != '') {
        return arrayFrom[0];
    } else {
        return false;
    }
}

// Función que borra y crea un nuevo json, con el objeto nuevo
function addUser(phone, name) {
    // Busca en el JSON si ya existe un nombre para este usuario
    // Si existe envía el parámetro delete
    // llega el parámetro delete si ya existe un nombre para este usuario
    // Borra el registro anterior para evitar ocupar memoria
    if (getUser(phone)) {
        for (let e = 0; e < userDB.length; e++) {
            if (userDB[e].from == phone) {
                userDB.splice(e, 1)
            }
        }
    }
    console.log(phone, name);
    userDB.push({ from: phone, userName: name })
    let obj = JSON.stringify(userDB)
    // Se elimina el archivo anterior
    //fs.unlink('./db/users.json')
    // Se crea el nuevo archivo con la nueva información
    fs.writeFile('./db/users.json', obj, error => {
        if (error) {
            console.log(error)
        }
        else {
            console.log(array(error => 'Creado con éxito'))
        }
    })
}

// Función para verificar si existe JSON la palabra ingresada por el usuario
function requestInclude(param) {
    let array = Object.values(keywordLib)
    let content = []
    array.forEach(element => {
        for (let i = 0; i < element.length; i++) {
            content.push(element[i])
        }
    });
    if (content.includes(param)) {
        return true
    } else {
        return false
    }
}

// Función para realizar un mensaje por default
function respondeDefault(params, word) {
    if (keywordLib[params].includes(word)) {
        return true;
    } else {
        return 'Lo siento, No entiendo el mensaje';
    }
}

main()