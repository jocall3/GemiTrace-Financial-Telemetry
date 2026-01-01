
import { GoogleGenAI } from "@google/genai";
import { TelemetryEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeTelemetryStream = async (events: TelemetryEvent[]) => {
  const eventSummary = events.map(e => ({
    time: e.timestamp,
    type: e.type,
    severity: e.severity,
    company: e.company,
    desc: e.description
  }));

  const prompt = `
    You are a Senior Compliance and Systems Architect for a global financial institution.
    Analyze the following stream of system telemetry events and provide a concise expert summary.
    
    EVENTS:
    ${JSON.stringify(eventSummary, null, 2)}
    
    TASKS:
    1. Identify any critical security or compliance patterns (look for account masking issues or unauthorized access).
    2. Suggest immediate remediation steps for the most severe issues found.
    3. Provide a "System Health Score" (0-100).
    4. Format the response in Markdown with clear headings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze telemetry stream. Please check API configuration.";
  }
};
