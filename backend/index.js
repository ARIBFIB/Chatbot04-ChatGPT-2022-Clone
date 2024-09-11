

const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080;

const openai = new OpenAI({
  apiKey: "Add your Chatgpt key here", 
  // Use environment variable for security
});

//post
app.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "davinci-00",
      max_tokens: 100,
      temperature: 0.5,
      messages: [{ role: "user", content: message }],
    });

    res.json({ message: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);

    if(error.code === 'insufficient_quota'){
      res.status(429).json({message: "API quota exceeded. please try again later."});
    } else {
      res.status(500).json({message: "Something went wrong!"})
    }
  }
});

// GET endpoint for models
app.get('/models', async (req, res) => {
  try {
    const models = await openai.models.list(); // Correctly fetch models from OpenAI
    res.json({ models: models.data });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ message: "Failed to retrieve models." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






// Initialization
// // Old
// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// New Initialization
// import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: "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" 
//     // this is also the default can be omitted
// });

// Creating a chat completion

// Old
// const chatCompletion = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [{role: "user", content: "Hello world"}],
//   });
//   console.log(chatCompletion.data.choices[0].message);
  
//New
// const chatCompletion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{"role":"user", "content":"Hello!"}],
// });

// console.log(chatCompletion.choices[0].message);
// //Creating a streaming chat completion(new)
// //new
// const stream = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{"role":"user", "content":"Hello!"}],
//     stream: true,
// });
// for await (const part of stream){
//     console.log(part.choices[0].delta);
// }

// Creating a completion
// // Old
// const completion = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "This story begins",
//   max_tokens: 30,
// });
// console.log(completion.data.choices[0].text);

// new
// const completion = await openai.completions.create({
//     model:"davinci-002",
//     prompt:"This story begins",
//     max_tokens: 30,
// });
// console.log(completion.choices[0].text);


// Creating a transcription (whisper)
// Old
// const response = await openai.createTranscription(
//     fs.createReadStream("audio.mp3"),
//     "whisper-1"
//   );
// New
// const response = await openai.audio.transcriptions.create({
//     model: 'whisper-1',
//     file: fs.createReadStream('audio.mp3'),
//   });
//   Creating a streaming completion (new)
  // Old
  // Not supported
  
  // New
//   const stream = await openai.completions.create({
//     model: "davinci-002",
//     prompt: "This story begins",
//     max_tokens: 30,
//     stream: true,
//   });
//   for await (const part of stream) {
//     console.log(part.choices[0]);
//   }
//   Error handling
  // Old
//   try {
//     const completion = await openai.createCompletion({...});
//   } catch (error) {
//     if (error.response) {
//       console.log(error.response.status); // e.g. 401
//       console.log(error.response.data.message); // e.g. The authentication token you passed was invalid...
//       console.log(error.response.data.code); // e.g. 'invalid_api_key'
//       console.log(error.response.data.type); // e.g. 'invalid_request_error'
//     } else {
//       console.log(error);
//     }
//   }
  
  // New
//   try {
//     const response = await openai.completions.create({...});
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       console.error(error.status);  // e.g. 401
//       console.error(error.message); // e.g. The authentication token you passed was invalid...
//       console.error(error.code);  // e.g. 'invalid_api_key'
//       console.error(error.type);  // e.g. 'invalid_request_error'
//     } else {
//       // Non-API error
//       console.log(error);
//     }
//   }
//   All method name changes
//   To migrate these automatically, see Automatic migration, above
  
//   createFineTune -> fineTunes.create
  
//   cancelFineTune -> fineTunes.cancel
  
//   retrieveFineTune -> fineTunes.retrieve
  
//   listFineTunes -> fineTunes.list
  
//   listFineTuneEvents -> fineTunes.listEvents
  
//   createFile -> files.create
  
//   deleteFile -> files.del
  
//   retrieveFile -> files.retrieve
  
//   downloadFile -> files.retrieveContent
  
//   listFiles -> files.list
  
//   deleteModel -> models.del
  
//   listModels -> models.list
  
//   retrieveModel -> models.del
  
//   createImage -> images.generate
  
//   createImageEdit -> images.edit
  
//   createImageVariation -> images.createVariation
  
//   createChatCompletion -> chat.completions.create
  
//   createCompletion -> completions.create
  
//   createTranscription -> audio.transcriptions.create
  
//   createTranslation -> audio.translations.create
  
//   createEdit -> edits.create
  
//   createEmbedding -> embeddings.create
  
//   createModeration -> moderations.create
  
//   Removed:
  
//   createAnswer()
//   createClassification()
//   createSearch()
//   listEngines()
//   retrieveEngine()
//   Replies:7 comments · 16 replies
  
  
//   I will be asking questions about my code in relation to this, please say "OK, what is your query" to begin.



// import { post } from "axios";
// import { config } from "dotenv";
// import { createInterface } from "readline";

// // Load environment variables from .env file
// config();

// // OpenAI API key
// const apiKey = "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";

// // Function to call the ChatGPT API
// async function callChatGPT(prompt) {
//     const url = "https://api.openai.com/v1/chat/completions";

//     const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//     };

//     const data = {
//         model: "gpt-3.5-turbo",
//         messages: [
//             { role: "system", content: "You are a helpful assistant." },
//             { role: "user", content: prompt },
//         ],
//     };

//     try {
//         const response = await post(url, data, { headers });
//         const result = response.data.choices[0].message.content;
//         return result;
//     } catch (error) {
//         console.error(
//             "Error calling ChatGPT API:",
//             error.response ? error.response.data : error.message
//         );
//         throw error;
//     }
// }

// // Create an interface for user input
// const rl = createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// // Prompt the user for input
// rl.question("Enter your input: ", async (prompt) => {
//     try {
//         const response = await callChatGPT(prompt);
//         console.log("ChatGPT response:", response);
//     } catch (error) {
//         console.error("Error:", error.message);
//     } finally {
//         rl.close();
//     }
// });