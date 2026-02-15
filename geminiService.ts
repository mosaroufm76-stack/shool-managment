
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudentPerformanceInsight = async (studentData: any) => {
  try {
    const prompt = `Analyze the following student data and provide a constructive performance insight in 2-3 sentences: ${JSON.stringify(studentData)}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional academic advisor. Provide concise, encouraging, and actionable insights based on data."
      }
    });

    return response.text || "Insight not available at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insights currently offline.";
  }
};

export const getPredictiveAnalysis = async (student: any, attendance: number, grades: any[]) => {
  try {
    const prompt = `Student: ${student.name}. Attendance: ${attendance}%. Previous Grades: ${JSON.stringify(grades)}. 
    Predict their likelihood of succeeding in final exams and suggest 2 improvement areas.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an AI Education Consultant. Use data to predict academic outcomes and offer strategic advice."
      }
    });

    return response.text || "Prediction engine is loading...";
  } catch (error) {
    return "Insufficient data for predictive analysis.";
  }
};

export const generateParentUpdate = async (student: any, progress: string) => {
  try {
    const prompt = `Write a polite 3-sentence formal update for the parents of ${student.name} summarizing this progress: ${progress}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a school principal communicating with parents. Be professional, warm, and clear."
      }
    });

    return response.text?.trim() || "Your child is making steady progress.";
  } catch (error) {
    return "Progress report is being finalized.";
  }
};

export const parseStudentAdmission = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract student details from this admission request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            rollNo: { type: Type.STRING },
            class: { type: Type.STRING },
            section: { type: Type.STRING },
            parentName: { type: Type.STRING },
            contact: { type: Type.STRING },
          },
          required: ["name"]
        },
        systemInstruction: "Extract student admission details from natural language text. If a field is missing, return an empty string. Standardize class format (e.g., '10th', '9th')."
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to parse admission prompt.");
  }
};

// Added analyzeTeacherWorkload function
export const analyzeTeacherWorkload = async (teacher: any) => {
  try {
    const prompt = `Analyze teacher workload for ${teacher.name} (${teacher.subject}). They teach classes: ${teacher.classes.join(', ')}. Current status: ${teacher.status}. Provide a professional 2-sentence assessment of their workload balance and burnout risk.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an HR academic consultant. Provide concise, professional, and observant workload analysis."
      }
    });
    return response.text || "Workload analysis unavailable.";
  } catch (error) {
    return "Workload analysis engine is offline.";
  }
};

// Added generateTeacherComment function
export const generateTeacherComment = async (studentName: string, subjectMarks: any[]) => {
  try {
    const prompt = `Student: ${studentName}. Performance Data: ${JSON.stringify(subjectMarks)}. Generate a professional and encouraging 2-sentence remark for their academic report card.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a school teacher writing remarks for a student's report card. Be encouraging, professional, and specific based on the provided marks."
      }
    });
    return response.text || "The student is showing consistent effort and progress across all subjects.";
  } catch (error) {
    return "Continue to work hard and focus on your academic goals.";
  }
};
