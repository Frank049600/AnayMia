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
const { param, get } = require('jquery')
const { constrainedMemory } = require('node:process')
const { delay } = require('@whiskeysockets/baileys')
const { format } = require('node:path')
const userDB = require(url + 'db/users.json')
const keywordLib = require(url + 'lib/keywords.json')
const answerLib = require(url + 'lib/answers.json')

const botondesentimiento = addKeyword('¿Cómo te sientes ?').addAnswer('Elige tu estado de animo', {
    buttons: [{ body: 'Bien :)' }, { body: 'Mal :(' }, { body: 'Triste :((' }, { body: 'Muy Feliz :)' }, { body: 'No muy bien :Z' }],
})

const flowDespedida = addKeyword(keywordLib.flowDespedida)
    .addAnswer('Nos vemos luego 🤗', null,
        async (ctx, { flowDynamic }) => {
            nombre = getUser(ctx.from)
            await flowDynamic(`No te olvides de nosotras ${nombre} 😉`)
        })
    .addAnswer("Quiérete, ámate, siéntete merecedor de todo lo bello del mundo desde el espíritu, no desde tu cuerpo nada más. Si aprendes a amar tu interior entenderás que tu exterior es perfecto como está.",
        {
            capture: true,
            idle: 60000 // 1 minuto
        }, // idle: 10000 = 10 segundos
        async (ctx, { gotoFlow, inRef }) => {
            if (ctx?.idleFallBack) {
                return gotoFlow(flujoMessageFinal)
            }
        }
    )

const flowThanks = addKeyword(keywordLib.flowThanks)
    .addAnswer('😇', null,
        async (ctx, { flowDynamic }) => {
            await flowDynamic(
                [
                    `No hay por que agradecer ${nombre}`,
                    `Es un placer poder ayudarte`
                ], null, null, [flowDespedida])
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
            await flowDynamic(`Puedes hablar con nosotras cuando tu lo decidas ${nombre}`)
        })
    .addAnswer('Recuerda que estamos para ti, siempre que nos necesites 😉', null, null, [flowThanks, flowDespedida])

const flowBat = addKeyword(keywordLib.flowBat)
    .addAnswer('Lo siento 😟', null,
        async (ctx, { flowDynamic }) => {
            nombre = getUser(ctx.from)
            console.log(nombre)
            await flowDynamic(`Pero no te preocupes, todo mejorará ${nombre} 😇`)
        })
    .addAnswer('¿Te gustaría platicar con nosotras 🙃?',
        {
            capture: true
        }, null, [flowResponseOk, flowResponseNo, flowDespedida])

const flowGood = addKeyword(keywordLib.flowGood)
    .addAnswer('Que alegría 😁', null,
        async (_, { flowDynamic }) => {
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
        'No te preocupes te proporcionaremos una lista con los contactos de profesionales que te podrán brindar un mayor apoyo. Acude con ellos cuanto antes. RECUERDA NO ESTAS SOL@.'])
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

const flujoMessageFinal = addKeyword(EVENTS.ACTION)
    .addAnswer('Hola, hace mucho que no sabemos de ti',
        {
            media: RUTE_IMG + "png-clipart-cartoon-animation-cartoon-farewell-party-cartoon-character-child.png"
        })
    .addAnswer('¿Platicamos 🙃?', null, null, [flowResponseOk, flowResponseNo])

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

const flowRemember = addKeyword(keywordLib.flowRemember)
    .addAnswer('Que gusto saludarte de nuevo 😄')
    .addAnswer('¿Cómo te sientes el día de hoy?', { capture: true }, null, [flowBat, flowGood])

const flowPrincipal = addKeyword(keywordLib.flowPrincipal)
    .addAnswer('¡Hola! 🤗', null,
        async (ctx, { gotoFlow }) => {
            if (getUser(ctx.from)) {
                nombre = getUser(ctx.from)
                return gotoFlow(flowRemember)
            }
        }
    )
    .addAnswer(['Creo que aun no nos conocemos 😧', '¿Cómo te llamas?'],
        {
            capture: true,
        },
        async (ctx, { gotoFlow, flowDynamic }) => {
            if (lengthInput(ctx.body)) {
                if (keywordLib.nameApodo.includes(ctx.body) || getApodos().includes(ctx.body)) {
                    return gotoFlow(flowPrincipal)
                } else {
                    addUser(ctx.from, ctx.body);
                    nombre = getUser(ctx.from);
                    await flowDynamic(`Encantadas en conocerte ${nombre} 🤗`)
                }
            } else {
                return gotoFlow(flowPrincipal)
            }
        })
    .addAnswer('¿Cómo te sientes el día de hoy?', { capture: true }, null, [flowBat, flowGood])

const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    })
    const adapterFlow = createFlow(
        [
            flowPrincipal,
            flowEmail,
            flowConfianza,
            flowPregunta,
            peticion_de_ayuda,
            flowOrientacion,
            flowAutoAtact,
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

function lengthInput(param) {
    if (param.length > 20) {
        return false
    }
    return true
}

function getApodos() {
    let apodo = [];
    (keywordLib.nameApodo).forEach(element => {
        apodo.push(element.toLowerCase())
    });
    return apodo
}

// Función que consume la API local, donde se guardan los usuarios
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

function updateFeel() {
    let params = 5214641479724
    let newFeel = 'bien'
    let newFrom, newUserName
    userDB.forEach(user => {
        newFrom = user.from
        newUserName = user.userName
    });
    let newUser = {
        from: newFrom,
        userName: newUserName,
        feel: newFeel
    }
    //for (let e = 0; e < userDB.length; e++) {
    //    if (userDB[e].from == params) {
    //        userDB.splice(e, 1)
    //    }
    //}
    userDB.push(newUser)
    console.log(userDB)
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
function respondeDefault(param, wordUser) {
    let wordsLib = param.ctx.keyword
    if (wordsLib.includes(wordUser)) {
        return true
    } else {
        return false
    }
}

main()