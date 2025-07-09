const {Together} = require('together-ai');
const dotenv = require('dotenv')
const axios = require('axios');
const input = require('prompt-sync')({ sigint: true });

dotenv.config();

const together = new Together({
    apiKey: process.env.GPT4_API_KEY
});


const systemPrompt = `
So you are an agent.You can use the following tools:\n - fetchWeather(city: string): returns weather of a city. and return a json format like this {
"action":"toolName",
"actionInput":"example : cityName"} , just return this, don't give unnecessary extra words."`

const tools = {
    fetchWeather : async (city) =>{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.Weather_api}`);
        const data = response.data;
        
        const weather = data.weather;
        console.log("Weather",weather)
        
        const weatherType = weather[0].main;
        const weatherDescription = weather[0].description;
        console.log(weatherType,weatherDescription)
        return { weatherType,weatherDescription };

    }
}


const prompt = input("Enter City Name :");

async function chat(weatherData){
    const userMessage = `Here is the weather data:\n${JSON.stringify(weatherData)}`;
    const response = await together.chat.completions.create({
            messages: [
                {"role": "system", "content": "You are a helpful assistant. Given weatherType and weatherDescription, return a natural language sentence summarizing the weather."},
                {"role": "user", "content": userMessage}],
            model:"mistralai/Mixtral-8x7B-Instruct-v0.1"    
          });
    
const raw = response?.choices[0]?.message?.content;
return raw;
}


async function callAi(){
    const response = await together.chat.completions.create({
            messages: [
                {"role": "system", "content": systemPrompt},
                {"role": "user", "content": prompt}],
            model:"mistralai/Mixtral-8x7B-Instruct-v0.1"    
          });
    
const raw = response?.choices[0]?.message?.content;
return raw;

}

async function runAgent(){
    const data = await callAi();
    
    let jsonData;
    jsonData = JSON.parse(data);
    

    const {action , actionInput} = jsonData;
console.log(actionInput)
console.log(action)

if(action === "fetchWeather"){
    const weatherData = await tools.fetchWeather(actionInput);    
    const response = await chat(weatherData);
    console.log(response)
}
}

async function main(){
    await runAgent();
}

main();
