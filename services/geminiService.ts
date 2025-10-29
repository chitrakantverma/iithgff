import { GoogleGenAI } from "@google/genai";
import type { SearchParams, Professor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchProfessorDetailsStream = async (
  { institute, department, keyword }: SearchParams,
  onProfessorFound: (professor: Professor) => void,
  onError: (error: Error) => void
): Promise<void> => {
  if (!institute && !department && !keyword) {
    throw new Error("Please provide an institute, department, or keyword to start the search.");
  }

  const prompt = `
    You are a smart outreach automation assistant. Your task is to fetch details of professors at selected IITs/NITs and stream them as you find them.

    User's Search Criteria:
    - Institute: ${institute || 'Any relevant IIT/NIT'}
    - Department/Branch: ${department || 'Any relevant department'}
    - Research Keyword/Topic: ${keyword || 'Not specified'}

    Rules:
    - Find professors matching the user's criteria.
    - If a keyword is provided, filter professors whose research aligns with the keyword.
    - For each professor, find all the required details.
    - CRITICAL: If you cannot find a valid, working webpage for the professor or their department, you MUST return "Link not working" for the "Institute Website" field. Do not invent links.
    - CRITICAL: Return each professor found as a separate, complete JSON object on a new line. Do not wrap them in a JSON array. Each line must be a valid JSON object.
    - If no professors are found, return nothing.

    Example of a single line of output for one professor:
    {"Name": "Dr. Example Name", "Designation": "Professor, Computer Science", "Institute": "IIT Example", "Email": "prof@example.com", "LinkedIn": "https://linkedin.com/in/prof", "Research Interests": "AI, ML", "Internship/Outreach": null, "Institute Website": "https://example.edu/prof", "Summary": "A summary of work."}
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let buffer = '';
    for await (const chunk of responseStream) {
      buffer += chunk.text;
      const lines = buffer.split('\n');

      // Keep the last potentially incomplete line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const professor = JSON.parse(line.trim());
            // Basic validation to ensure we have a valid object
            if (professor.Name && professor.Designation) {
                onProfessorFound(professor);
            }
          } catch (e) {
            console.warn("Could not parse a line of streamed JSON:", line, e);
          }
        }
      }
    }
    
    // Process any remaining data in the buffer from the final chunk
    if (buffer.trim()) {
        try {
            const professor = JSON.parse(buffer.trim());
            if (professor.Name && professor.Designation) {
                onProfessorFound(professor);
            }
        } catch (e) {
            console.warn("Could not parse the final buffer of streamed JSON:", buffer, e);
        }
    }

  } catch (error: any) {
    console.error("Error fetching data from Gemini API:", error);
    onError(new Error("Failed to fetch professor details. The model may be unable to find information for the given query."));
  }
};