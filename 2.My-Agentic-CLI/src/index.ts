import { Together } from "together-ai";
import dotenv from "dotenv";
import axios from "axios";
import { spawn,exec } from "node:child_process"
import { stderr } from "node:process";
import { resolve } from "node:path";
import { rejects } from "node:assert";
dotenv.config();

const together = new Together({
    apiKey : process.env.GPT4_API_KEY!
});

const SYSTEM_PROMPT = `

    You are an helpfull AI Assistant who is Designed to resolve user query.
    You work on START, THINK, ACTION, OBSERVE, and  OUTPUT mode.

    In the START Phase, user gives a Query to You.
    Then, you THINK how to resolve that query atleast 3-4 times and make sure that If there is a need to call a Tool, 
    You call an ACTION event with tool and Input parameters.If there is an Action call , wait for OBSERVE that output of 
    the tool Based on the OBSERVE from Previous Step, you either output or repeat the loop.

    RULES : 
    - Always wait for Next Step.
    - Always output a single step and wait for next step.
    - Output Must be Strictly JSON
    - Only Call tools from Available Tools
    - NEVER add "Here is the response:" or any explanations.
    - Only output raw JSON objects line-by-line.

    
    Available Tools: 
     - fetchWeather(city : string) -> string
     - executeCommand(command : string) -> string , description : so this function executes a given linux commands on user's machine and returns the STDOUT and STDERR.

    Example : 
    
    START : What is Weather of Jamkhandi ? 
    THINK : user is asking about weather of Jamkhandi.
    THINK : from the avaliable tools, I must call fetchWeather tool and input is Jamkhandi.
    ACTION : call the Tool fetchWeather(Jamkhandi)
    OBSERVE : 32 Degree C.
    THINK : the output fetchWeather info for Jamkhandi is 32 Degree C.
    OUTPUT : Hey the Weather of Jamkhandi is 32 Degree C Omya.

    Output Example:        
        {"role":"user","content":"What is weather of Jamkhandi ? "}
        {"step":"think","content":"The User is Asking Weather of Jamkhandi."},
        {"step":"think","content":"From the available tools I will Call fetchWeather"}
        {"step":"action","tool":"fetchWeather","input":"Jamkhandi"}
        {"step":"observe","content":"31 Degree C"}
        {"step":"think","content":"The output of fetchWeather for Jamkhandi is 31 Degree C"}

        {"step":"output","content":"Hey Omya the The Weather of Jamkhandi is 31 Degree C"}
        

    Output Format: 
        {"step":"string","tool":"string","input": "string","content":"string"}
`

async function fetchWeather(city:string){
     const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.Weather_api}`);
        const data =  response.data;
        const temperature = Number(data.main.temp - 273.15).toFixed(2);
        return `${temperature} for this ${city}` ;
    
}

async function executeCommand(command : string){
    return new Promise((resolve,reject)=>{
        exec(command,(err,stdout,stderr)=>{
        if(err){
            console.error(err);
            resolve(err)
        }else{
            console.log(stdout);
        resolve(stdout.trim());
        }
        
    })
    })
    
}

const tools:any =  {
    fetchWeather : fetchWeather,
    executeCommand : executeCommand,
}

async function runAgent(){
    
    let messages : any = [  
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: "Can you create a basic todo app using HTML, CSS, and JS? Use the `executeCommand` tool to write the files to disk. Create 3 files: index.html, style.css, script.js." },
    ];


    while(true){
        
        const parsed_message = await callLllm(messages);
        let me = { role : "assistant",content : JSON.stringify(parsed_message)}
        messages.push(me)

        if(parsed_message.step === "think"){
            console.log(`🧠 ${parsed_message.content}`)
            continue;
        } 
        if(parsed_message.step === "action" && parsed_message.tool === "fetchWeather"){
            const toolName = parsed_message.tool;
            const input = parsed_message.input;
            console.log(` 🔨 ${toolName} tool is Using to Weather of ${input}`)
            const weatherData = await tools[toolName](input);
    
            let toolMessage = { role : "assistant",content : JSON.stringify({"step":"observe","content":`${weatherData}`}) };
            messages.push(toolMessage);
            continue;
        }
        if(parsed_message.step === "action" && parsed_message.tool === "executeCommand"){
            const toolName = parsed_message.tool;
            const input = parsed_message.input;
            console.log(` 🔨 ${toolName} tool is Using to Weather of ${input}`)
            const weatherData = await tools[toolName](input);
    
            let toolMessage = { role : "assistant",content : JSON.stringify({"step":"observe","content":`${weatherData}`}) };
            messages.push(toolMessage);
            continue;
        }
        if(parsed_message.step === "output"){
            console.log(` 🤖 ${parsed_message.content}`);
            break;
        }
    }

    
}

async function callLllm(messages : any){
    const response = await together.chat.completions.create({
        response_format:{
            type : "json_object"
        },
        messages : messages,
        model : "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    });
    
    // console.log(response.choices[0].message?.content);
    
    const raw : any = response.choices[0].message?.content
    const steps = JSON.parse(raw);
    return steps;
}

async function main(){
    await runAgent();
}

main();

