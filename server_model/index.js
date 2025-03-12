const express = require('express');
const https = require('https');
const app = express();
const axios = require('axios');
const allroutes = require('./routes/AllRoutes');
const mongoose = require('mongoose');
const {predictionsModel,reportIdsModel,reportDatasModel}=require("./schemas/allSchemas");
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
const pdfParse = require('pdf-parse');
const multer = require("multer");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

dotenv.config();
app.use(bodyParser.json());
app.use(cors());
const genAI = new GoogleGenerativeAI(process.env.API_KEY);



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API to get the list of available reports
app.get("/api/reports", (req, res) => {
  const reportsDir = path.join(__dirname, "uploads");

  fs.readdir(reportsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read reports" });
    }

    const reportFiles = files.map((file) => ({
      name: file,
      url: `/uploads/${file}`,
    }));

    res.json(reportFiles);
  });
});



const apiKey = process.env.GEMINI_API_KEY;
const upload = multer({ dest: "uploads/" });

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a medical reports analyzer. Analyze the reports and provide output in JSON format with the keys: Short-Analysis, Date of report, Precautions, Possible disease risks, Severity (out of 10), and Specialist required.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.post("/analyze", upload.single("report"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const filePath = path.join(__dirname, req.file.path);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const pdfText = data.text;

    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(pdfText);
    
    fs.unlinkSync(filePath); // Remove the uploaded file after processing
    
    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process the report" });
  }
});
// const { handleUserQuery } = require('./chatbotHandler'); // Adjust the path as needed
// const {
//   usersModel,
//   patientIdModel,
//   careIDsModel,
// } = require('./schemas/allSchemas'); 

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    
    // Extract response correctly
    const responseText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response.";

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.post('/chatbot',async(req,res)=>{
  let {prompt} = req.body;
  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }
  try{
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to generate content");
  }

})


app.post("/save", (req, res) => {
  const updatedData = req.body;
  // Handle the logic to save the updated data
  // For example, you might save it to a database or a file
  console.log('Received data to save:', updatedData);
  res.send({ success: true, message: "Data saved successfully" });
});


app.post('/ask-question', async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post('http://localhost:5001/ask', { question });
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});



let db = async () => { 
  try{ 
      console.log(process.env.DBURI);
      await mongoose.connect(process.env.DBURI);
      console.log("connected to database");
  }
  catch(err) {
      console.log('error connecting');
  }
}
db();

app.use('/api', allroutes);
const port = 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});






























































app.post('/pedict', async (req, res) => {
  const { userId, reportId } = req.body;

  if (!userId || !reportId) {
    return res.status(400).send({ error: 'userId and reportId are required' });
  }

  try {
    // Find the specific report for the user
    const report = await reportDatasModel.findOne({ userId, _id: reportId });

    if (!report || !report.reportPdf) {
      return res.status(404).send({ error: 'Report not found or missing reportPdf data' });
    }

    // Convert the reportPdf object to a string
    let reportText = JSON.stringify(report.reportPdf, null, 2);

    // Prepare data for Gemini
    let prompt = `Analyze the following medical report and provide your prediction. Report:\n${reportText}\n`;
    prompt += " Your response should consist of 2 parts. The first part is the disease/diagnosis you made, justification for it with heading Predicted disease: and the second part is the risk of the person classified as low, medium, or high risk with the heading Risk Prediction: followed by a percentage for risk. Do not include any other text.";

    // Send data to Gemini for prediction
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Log the response text for debugging
    console.log('Gemini API response:', text);

    // Extract the prediction details from the response text
    const [predictedDisease, riskPrediction] = text.split('Risk Prediction:');

    // Check if the response contains the expected parts
    if (!predictedDisease || !riskPrediction) {
      return res.status(500).send({ error: 'Invalid response format from Gemini API' });
    }

    const [diseaseHeading, disease] = predictedDisease.split('Predicted disease:');

    // Extract the numeric risk percentage
    const riskPercentMatch = riskPrediction.match(/(\d+)%/);
    const riskPercent = riskPercentMatch ? parseInt(riskPercentMatch[1], 10) : null;

    if (riskPercent === null) {
      return res.status(500).send({ error: 'Invalid risk percentage format from Gemini API' });
    }

    // Save the prediction in the database
    const newPrediction = new predictionsModel({
      predictionId: new mongoose.Types.ObjectId().toString(),
      userId,
      reportIds: [reportId],
      LLMPrediction: disease ? disease.trim() : 'N/A',
      riskPercent: riskPercent
    });

    await newPrediction.save();

    // Update the reportIdsModel with the new prediction ID
    const reportIds = await reportIdsModel.findOne({ userId });
    reportIds.PredictionID.push(newPrediction.predictionId);
    await reportIds.save();

    // Send the prediction back to the client
    res.send(newPrediction);

  } catch (error) {
    console.error('Error processing diagnosis:', error);
    res.status(500).send({ error: error.message });
  }
});



app.post('/diagnose', async (req, res) => {
  const { userId, reportId } = req.body;

  if (!userId || !reportId) {
    return res.status(400).send({ error: 'userId and reportId are required' });
  }

  try {
    // Find the specific report for the user
    const report = await reportDatasModel.findOne({ userId, _id: reportId });
    console.log(report)
    if (!report || !report.reportPdf) {
      return res.status(404).send({ error: 'Report not found or missing reportPdf data' });
    }

    // Convert the reportPdf object to a string
    let reportText = JSON.stringify(report.reportPdf, null, 2);
    reportText +="diagnoise the report and predict the disease ";
    // Make the request to the Flask API
    const response = await axios.post('http://localhost:5002/diagnose', {
      content: reportText
    });
    
    const diagnosis = response.data.diagnosis;
    const riskMatch = diagnosis.match(/risk percentage: (\d+)%/i);
    const riskPercent = riskMatch ? parseInt(riskMatch[1], 10) : null;


    // Save the prediction in the database
    const newPrediction = new predictionsModel({
      predictionId: new mongoose.Types.ObjectId().toString(),
      userId,
      reportIds: [reportId],
      LLMPrediction: diagnosis,
      riskPercent: riskPercent
    });

    await newPrediction.save();

    // Update the reportIdsModel with the new prediction ID
    const reportIds = await reportIdsModel.findOne({ userId });
    reportIds.PredictionID.push(newPrediction.predictionId);
    await reportIds.save();

    // Send the prediction back to the client
    res.send(newPrediction);

  } catch (error) {
    console.error('Error processing diagnosis:', error);
    res.status(500).send({ error: error.message });
  }
});

