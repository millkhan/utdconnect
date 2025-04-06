import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

const MATCHING_CONFIG = {
    responseMimeType: 'application/json',
    responseSchema: {
        type: "object",
        properties: {
            match_email: {
                type: "string",
                description: 'email of student chosen to pair up with the user.',
                nullable: false,
            },
            explanation: {
                type: "string",
                description: 'Explanation directed towards the user for why student was chosen to connect with.',
                minLength: 300,
                nullable: false,
            },
            icebreaker: {
                type: "string",
                description: 'A good icebreaker question user can ask match.',
                nullable: false,
            },
        },
        required: ['match_email', 'explanation', 'icebreaker']
    }
}

const RESPONSE_CONFIG = {
    responseMimeType: 'application/json',
    responseSchema: {
        type: "object",
        properties: {
            message: {
                type: "string",
                description: 'The response directed towards the user as if you (mock student) were talking to them.',
                nullable: false,
            },
        },
        required: ['message']
    }
}

const match_student = async (student_group, searching_student) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Based off these students: ${student_group}.
    
        pair ONLY ONE of them with the following user:${JSON.stringify(searching_student)}.`,
        config: MATCHING_CONFIG
    });

    const match = JSON.parse(response.text);
    match.chat_id = crypto.randomUUID();

    return match;
}

const generateResponse = async (chat_history, matchExplanation) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Based off the match explanation: ${JSON.stringify(matchExplanation)}
        and the following chat history (messages marked is_user: true is the user's messages): ${JSON.stringify(chat_history)}

        come up with a response as if you were responding to the user's messages.`,
        config: RESPONSE_CONFIG
    });

    return JSON.parse(response.text);
}

export { match_student, generateResponse };