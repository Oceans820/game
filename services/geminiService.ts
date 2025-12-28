
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getPoeticDialogue = async (levelName: string, levelId: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个极简主义诗人。为一个关于“剥离影子并将其折叠成实体”的小游戏写一段短小的台词（30字以内）。
      关卡名称：${levelName}
      关卡序号：${levelId}
      风格：忧郁但充满希望，黑白几何美学，探讨光与影的哲学。`,
      config: {
        maxOutputTokens: 100,
        temperature: 0.8,
      }
    });
    return response.text || "影子是光的余温，折叠它是我的使命。";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "在明暗的边缘，我学会了建筑。";
  }
};
