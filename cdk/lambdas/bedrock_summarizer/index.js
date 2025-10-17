const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body || "{}");
    const text = body.text || "";

    if (!text) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Missing 'text' field in request body." }),
      };
    }

    const modelId = "amazon.titan-text-lite-v1";
    const prompt = `You are a high-level expert in adaptation and response strategies to crises and natural disasters of all kinds.Summarize the following emergency message and provide an action plan:\n\n${text}`;

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: prompt,
        textGenerationConfig: {
          temperature: 0.5,
          maxTokenCount: 512,
        },
      }),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder("utf-8").decode(response.body));
    console.log("Raw model response:", JSON.stringify(responseBody, null, 2));

    const summary = responseBody.results?.[0]?.outputText || "No summary generated.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ summary }),
      isBase64Encoded: false,
    };

  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to generate summary",
        details: error.message || error.toString(),
      }),
    };
  }
};
