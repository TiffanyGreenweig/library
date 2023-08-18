const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
const OpenAI = require('openai');
const dotenv = require('dotenv')

dotenv.config()
const GPT_API_KEY = process.env.OPENAI_API_KEY

console.log('GPT_API_KEY====', GPT_API_KEY)
if (!GPT_API_KEY) {
    console.log("请配置 ChatGPT API Key")
    return
}

const openai =  new OpenAI({
    apiKey: GPT_API_KEY,
    timeout: 3000,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

app.listen(PORT, () => {
    console.log(`Node.js 服务正在监听 ${PORT} 端口 ...`);
});

app.post("/convert", async (req, res) => {
    //👇🏻 解构 JSON 对象
    let { value } = req.body;

    console.log('==== value =====>', {value, n: JSON.parse(value).user})

    //👇🏻 向 ChatGPT 提问
    const prompt = `Convert the JSON object into Typescript interfaces \n ${JSON.parse(value).user} Please, I need the only the code, I don't need any explanations.`;

    console.log('====== prompt =====>', prompt)

    // New
    openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    // model: "gpt-4",
    messages: [{"role": "user", "content": "Hello!"}],
    }).then(chatCompletion => {
        console.log('completion =====>', chatCompletion.choices[0].message)
        res.json({
            message: "Successful",
            response: chatCompletion.choices[0].message,
        });
    }).catch(err => {
        console.log('err =====>', err.message)
    }).finally(() => {
        console.log('finally =====>')
    })



});
