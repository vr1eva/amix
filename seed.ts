const OpenAI = require("openai");

const openai = new OpenAI();

async function main() {
    const assistant = await openai.beta.assistants.create({
        instructions: "eres un asistente de la metodologia de la investigacion.",
        name: "Amix",
        tools: [{
            type: "code_interpreter"
        }, {
            type: "retrieval",
        }],
        model: "gpt-3.5-turbo-1106"
    })
    console.log(assistant)
}

main();