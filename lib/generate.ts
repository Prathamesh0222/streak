import { Habit } from "@/types/habit-types";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "./prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateWeeklyInsights = async (
  weekStart: Date,
  userEmail: string,
  habits: Habit[]
) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weeklyData = {
    habits: habits.map((habit) => ({
      title: habit.title,
      category: habit.category,
      currentStreak: habit.currentStreak,
      totalCompletions: habit.totalCompletions,
      goalProgress: habit.goalProgress,
      completedToday: habit.completedToday,
    })),
    weekRange: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
  };

  const prompt = `
    Analyze this user's weekly habit data and provide 3-4 brief weekly insights.
    
    Weekly Data:
    ${JSON.stringify(weeklyData, null, 2)}
    
    Please provide insights in this exact JSON format:
    {
      "insights": [
        {
          "title": "Brief insight title (max 6 words)",
          "description": "One clear sentence with specific numbers. Max 25 words.",
          "type": "achievement|pattern|prediction|recommendation",
          "priority": "high|medium|low"
        }
      ]
    }
    
    Requirements:
    - Title: Maximum 6 words
    - Description: Maximum 25 words, one sentence only
    - Include specific numbers/percentages
    - Be encouraging and actionable
    - Focus on the most important insight only
    
    Return only valid JSON, no markdown formatting.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    let aiInsights;
    try {
      aiInsights = JSON.parse(cleanText!);
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      throw new Error("Failed to parse AI response");
    }

    await prisma.weeklyInsight.create({
      data: {
        userEmail,
        weekStart,
        insights: aiInsights.insights,
      },
    });

    return aiInsights.insights;
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw new Error("Failed to generate AI insights");
  }
};
