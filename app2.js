const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowRemember = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        nombre = getUser(ctx.from);
        console.log('nombre');
        await flowDynamic(`Que gusto 🤗, ¿Cómo has estado ${nombre}?`)
    })

const botondesentimiento = addKeyword('¿Cómo te sientes ?').addAnswer('Elige tu estado de animo', {
    buttons: [{ body: 'Bien :)' }, { body: 'Mal :(' }, { body: 'Triste :((' }, { body: 'Muy Feliz :)' }, { body: 'No muy bien :Z' }],
})

//CREACIÓN DE INTENT " ORIENTACION CON PROFESIONALES"



const orientacion = addKeyword(['No es suficiente tu ayuda', 'Necesito mayor apoyo', 'Necesito acudir con un profesional', 'Ya no puedo mas con esto', 'Creo que necesito mas ayuda', 'Me podrias ayudar mas', 'Necesito mas apoyo', 'Conoces a alguien mas que me pueda ayudar'])
    .addAnswer(['No te preocupes te proporcionaremos una lista con los contactos de profesionales que te podran brindar un mayor apoyo. Acude con ellos cuanto antes. RECUERDA NO ESTAS SOL@.'])
    .addAnswer(['(LISTA DE CONTACTOS)'])

//CREACIÓN DE INTENT "PETICION DE AYUDA"



const peticionde_ayuda = addKeyword(['¿Que debo hacer?', 'Tengo dudas', 'Estoy intranquila', 'Quiero platicar'])
    .addAnswer(['No te preocupes estamos para ayudarte, recuerda que somos tus amigas y estamos simpre para ti. Vamos a platicar va.'])


//CORRECCIÓN DE INTENTS AVANCE ANTERIOR

//CREACIÓN DE INTENT " SALUDO"



const saludo = addKeyword(['Hola', 'Hi', 'Holis', 'Qué tal'])
    .addAnswer(['Bienvenid@, somos Ana y Mia . ', '¿Como podemos ayudarte?'])


//CREACIÓN DE INTENT "DESPEDIDA"



const DESPEDIDA = addKeyword(['Adiós', 'Adiós', 'Bye', 'Hasta luego', 'Nos vemos'])
    .addAnswer(['Nos vemos pronto.'])
    .addAnswer(['Fue un gusto saludarte :)'])

//CREACIÓN DE INTENT "Sentimientos negativos"


const sentimiento = addKeyword(['Me siento mal', 'Es un mal dia', 'No me encuentro nada bien', 'Estoy mal', 'Estoy triste'])
    .addAnswer(['No te preocupes,todo mejorará'])
    .addAnswer(['¿Te gustaría platicar con nosotras?'])


//CREACIÓN DE INTENT "Sentimientos positivo"



const sentimientop = addKeyword(['Me siento bien', 'Es un buen dia', 'Me encuentro  bien', 'Estoy bien', 'Estoy feliz'])
    .addAnswer(['Nos alegramos mucho por ti. Sigue teniendo un bello dia. :) '])


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([saludo, sentimiento, DESPEDIDA, peticionde_ayuda, orientacion])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
