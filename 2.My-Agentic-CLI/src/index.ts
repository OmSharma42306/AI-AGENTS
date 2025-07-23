import { Together } from "together-ai";
import dotenv from "dotenv";
dotenv.config();

const together = new Together({
    apiKey : process.env.GPT4_API_KEY!
});

const SYSTEM_PROMPT = `
    Output Example:
        [{"role":"user","content":"What is weather of Jamkhandi ? "},
        {"step":"think","content":"The User is Asking Weather of Jamkhandi."},
        {"step":"think","content":"From the available tools I will Call fetchWeather"},]

    Output Format: 
        {"step":"string","tool":"string","input": "string","content":"string"}
`

function fetchWeather(city:string){
    console.log("City omya",city);
    return "32.C";
}

async function callLllm(){
    const response = await together.chat.completions.create({
        messages:[
            {"role":"system",content:`${SYSTEM_PROMPT}`},
            {"role":"user","content":"What is the Weather of Banahatti ? "}],
        model:"mistralai/Mixtral-8x7B-Instruct-v0.1"
    });
    
    console.log(response.choices[0].message?.content);
    const raw : any = response.choices[0].message?.content
   
    const res = JSON.parse(raw);
    
    res.map((data:any)=>{
        if(data.step === "tool" ){
            fetchWeather(data.input);
            console.log("data",data.tool)
        }
    })
   
}

async function main(){
    await callLllm();
}

main();

