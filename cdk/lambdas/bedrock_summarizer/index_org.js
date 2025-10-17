const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event));

    // ✅ Safer parsing for body input
    let body;
    if (typeof event.body === "string") {
      try {
        // Remove stray quotes from API Gateway proxy
        const clean = event.body.trim().replace(/^'|'$/g, "");
        body = JSON.parse(clean);
      } catch (err) {
        console.error("Body parse error:", err, "Raw body:", event.body);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid JSON body", details: err.message }),
        };
      }
    } else {
      body = event.body || event;
    }

    const message = body.message || body.text || "No message provided";

    // --- Prompt for Bedrock ---
    const prompt = `
You are a high-level expert in adaptation and response strategies to crises and natural disasters of all kinds.
Provide a summary of the following incident in 4 sentences with it's potential impacts.
After that, provide an operational action plan proposition with no extra text.
Return ONLY valid JSON in this format, with no extra text:

{
 
 "summary": "Event summary and potential impacts",
 "actionPlan": ["step 1", "step 2", "step 3"]
  
}

Incident: ${message}
`;

    const input = {
      modelId: "amazon.titan-text-lite-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          temperature: 0.3,
          maxTokenCount: 300,
        },
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    const raw = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Raw model response:", raw);

    // ✅ Parse AI output safely
    let result;
    try {
      const match = raw.results[0].outputText.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : { summary: raw.results[0].outputText, actionPlan: [] };
    } catch (err) {
      console.error("Failed to parse JSON from model output:", err);
      result = { summary: raw.results[0].outputText, actionPlan: [] };
    }

			return {
		  statusCode: 200,
		  headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		  },
		  body: JSON.stringify({
			summary,
			actionPlan: [],
		  }),
		  isBase64Encoded: false,
		};
  } catch (error) {
    console.error("Error in summarizer Lambda:", error);
    return {
	  statusCode: 500,
	  headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "Content-Type",
	  },
	  body: JSON.stringify({ error: "Failed to generate summary" }),
	};
  }
};
