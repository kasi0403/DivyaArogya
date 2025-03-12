const fs = require("fs");
const pdfParse = require("pdf-parse");
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HF_API_KEY);

// Function to extract text from a PDF
async function extractTextFromPDF(pdfPath) {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);
    return data.text; // Extracted text
}

// Function to send extracted text to Hugging Face API
async function analyzeMedicalReport(pdfPath) {
    try {
        const extractedText = await extractTextFromPDF(pdfPath);

        const chatCompletion = await client.chatCompletion({
          model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "user",
                    content: `you are a medical reports analyzer which analyze the reports and give output in a specific format where the  Keys are summary of analysis, Date of report , Precautions, Possible disease risks, severity rating out of 10, which specialist(one or less) is needed. the format of output should be in:  Short-Analysis:String,Precautions:Array,Possible-disease risks:Array,Severity:int,specialist:String as json format\n Extracted Text : \n ${extractedText}`,
                }
            ],
            // provider: "hf-inference",
            provider: "sambanova",
            max_tokens: 500,
        });

        console.log(chatCompletion.choices[0].message);
    } catch (error) {
        console.error("Error processing PDF:", error);
    }
}

// Run the analysis with a sample PDF
const pdfFilePath = {pdfPath}; 
analyzeMedicalReport(pdfFilePath);

