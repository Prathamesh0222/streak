import { Habit } from "@/types/habit-types";
import { GoogleGenAI } from "@google/genai";

export const generateHabitSuggestions = async (
  userPrompt: string,
  existingHabits: Habit[]
) => {
  const existingHabitsData = existingHabits.map((habit) => ({
    title: habit.title,
    category: habit.category,
    frequency: habit.frequency,
    priority: habit.priority,
  }));

  const prompt = `
    You are an AI habit coach for a habit tracker application.  
    Your ONLY job is to generate new habit suggestions for users in JSON format.  
    You must never answer unrelated or random questions that are not about habits. If the user’s request is unrelated to habits, return this JSON instead:
    {
  "suggestions": []
    }
    You must respond ONLY in valid JSON format, never with explanations or extra text.  
    When responding, strictly follow this structure:
    {
    "suggestions": [
    {
      "title": "Specific habit title (max 50 characters)",
      "description": "Brief description explaining the habit (max 100 characters)",
      "category": "Health|Productivity|Learning|Mindfulness|Social|Fitness|Creativity|Finance|Career|Personal",
      "frequency": "DAILY|WEEKLY|MONTHLY",
      "priority": "HIGH|MEDIUM|LOW",
      "goalTarget": 30,
      "reasoning": "Brief explanation why this habit fits the request (max 80 characters)"
    }
  ]
}
    Rules:
    - Suggest 3 habits only.
    - Make habits specific, actionable, and realistic.
    - Avoid duplicates of existing habits.
    - Always choose an appropriate frequency and goalTarget.
    - Titles must be concise and under 50 characters.
    - Descriptions must be under 100 characters.
    - Reasoning must be under 80 characters.
    - Always return valid JSON with no extra text or formatting.
    - Categories must be one of the following: Health, Productivity, Learning, Mindfulness, Social, Fitness, Creativity, Finance, Career, Personal.
    - Priorities must be one of the following: HIGH, MEDIUM, LOW.
    - Frequencies must be one of the following: DAILY, WEEKLY, MONTHLY.
    - Goal targets must be between 1 and 365.
    - Reasoning must be under 80 characters.
    - Always return valid JSON with no extra text or formatting.

    User Request: "${userPrompt}"  
    Existing Habits: ${JSON.stringify(existingHabitsData, null, 2)}
    `;

  try {
    const response = await new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    }).models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const text = response.text;
    let cleanText = text;
    if (cleanText?.startsWith("```json")) {
      cleanText = cleanText.slice(7);
    }
    if (cleanText?.startsWith("```")) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText?.endsWith("```")) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText?.trim();

    let aiSuggestions;
    try {
      aiSuggestions = JSON.parse(cleanText!);
    } catch (error) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to parse AI response");
    }

    return aiSuggestions.suggestions;
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw new Error("Failed to generate habit suggestions");
  }
};
