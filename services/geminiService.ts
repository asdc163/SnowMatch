import { GoogleGenAI } from "@google/genai";
import { CertBody } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generates a catchy bio for an instructor based on their details
export const generateInstructorBio = async (
  name: string,
  cert: CertBody,
  experience: number,
  style: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Write a short, catchy, professional yet fun Tinder-style bio (max 40 words) for a ski instructor named ${name}.
      Certification: ${cert}.
      Years of Experience: ${experience}.
      Teaching Style/Specialty: ${style}.
      Tone: Enthusiastic, trustworthy, cool.
      Do not include hashtags.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I love skiing and teaching!";
  } catch (error) {
    console.error("Gemini Bio Generation Failed", error);
    return "Passionate instructor ready to help you level up on the slopes!";
  }
};

// Simulates a background check on certification requirements
export const getCertificationInfo = async (certBody: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
          Provide a 1-sentence summary of what the ${certBody} ski instructor certification represents in terms of quality and prestige.
        `;
    
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
        });
    
        return response.text || "Recognized international certification.";
      } catch (error) {
        return "Verified Certification Body.";
      }
}
