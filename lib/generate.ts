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
    Analyze this user's weekly habit data and provide 3-4 comprehensive weekly insights.
    
    Weekly Data:
    ${JSON.stringify(weeklyData, null, 2)}
    
    Please provide insights in this exact JSON format:
    {
      "insights": [
        {
          "title": "Weekly insight title",
          "description": "Detailed weekly analysis with specific numbers and trends",
          "type": "achievement|pattern|prediction|recommendation",
          "priority": "high|medium|low"
        }
      ]
    }
    
    Focus on:
    1. **Weekly Achievements**: What they accomplished this week
    2. **Weekly Patterns**: Trends, best/worst days, category performance
    3. **Weekly Predictions**: Next week forecasts based on current trends
    4. **Weekly Recommendations**: Specific actions for next week
    
    Make insights:
    - Specific with actual numbers and percentages
    - Actionable with clear next steps
    - Encouraging and motivating
    - Based on the full week's data
    
    Return only valid JSON, no additional text.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    let aiInsights;
    try {
      aiInsights = JSON.parse(text!);
    } catch (error) {
      console.error("Failed to parse Gemini response:", text);
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
