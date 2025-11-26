import { GoogleGenAI } from "@google/genai";
import { GeneratorState, ImageData } from "../types";
import { PLATFORM_CONFIGS } from "../constants";

// Helper to get aspect ratio string for the API
const getAspectRatio = (platformId: string): string => {
  const config = PLATFORM_CONFIGS.find(p => p.id === platformId);
  return config ? config.ratioValue : '1:1';
};

export const generateCover = async (
  apiKey: string,
  state: GeneratorState
): Promise<{ base64: string; mimeType: string }> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const aspectRatio = getAspectRatio(state.platform);
  
  // Construct the text prompt
  const prompt = `
    你是一个世界级的平面设计师和视觉艺术家。请为社交媒体视频生成一张极具吸引力的“爆款”封面图。
    
    【核心信息】
    - 平台格式：${state.platform}
    - 主标题（必须清晰可见）：${state.mainTitle}
    - 副标题（辅助说明）：${state.subTitle}
    
    【设计风格】
    - 风格关键词：${state.selectedTags.join(', ')}
    - 额外要求：${state.customPrompt}
    
    【技术要求】
    1. 画质：8K 分辨率，摄影级超高清，光影质感真实。
    2. 文字渲染：必须极其准确地渲染主标题和副标题的中文汉字，字体设计要符合“爆款”特征（如粗体、描边、发光、立体效果），确保在移动端小屏幕上依然清晰可读。
    3. 构图：主体突出，视觉中心明确，留出足够的文字排版空间。
    ${state.subjectImage ? '4. 请将提供的【主体参考图】中的人物或物体自然地融入画面中心。' : ''}
    ${state.styleImage ? '5. 请严格参考提供的【风格参考图】的配色方案、排版布局和整体氛围。' : ''}
    
    请直接生成最终的封面图片。
  `;

  const parts: any[] = [{ text: prompt }];

  if (state.subjectImage) {
    parts.push({
      inlineData: {
        data: state.subjectImage.base64,
        mimeType: state.subjectImage.mimeType
      }
    });
  }

  if (state.styleImage) {
    parts.push({
      inlineData: {
        data: state.styleImage.base64,
        mimeType: state.styleImage.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any, // Cast because SDK types might be strict string literals
          imageSize: '1K' // Default to 1K for speed, ask model implies higher quality logic internally
        }
      }
    });

    // Extract image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png'
          };
        }
      }
    }
    
    throw new Error("未能生成图片，请重试。");

  } catch (error: any) {
    console.error("Generate Error:", error);
    throw new Error(error.message || "生成失败，请检查 API Key 或网络连接。");
  }
};

export const editCover = async (
  apiKey: string,
  currentImageBase64: string,
  instruction: string
): Promise<{ base64: string; mimeType: string }> => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    基于提供的这张图片，请执行以下修改指令：
    "${instruction}"
    
    要求：
    1. 保持原图的高画质和原有文字内容的准确性（除非指令要求修改文字）。
    2. 修改后的图片必须依然符合社交媒体封面图的美学标准。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              data: currentImageBase64,
              mimeType: 'image/png' // Assuming previous output was PNG
            }
          }
        ]
      }
      // Note: Editing might inherit aspect ratio from input or default. 
      // We don't strictly set imageConfig here to let the model follow the input image dimensions.
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png'
          };
        }
      }
    }
    throw new Error("未能修改图片。");

  } catch (error: any) {
    console.error("Edit Error:", error);
    throw new Error(error.message || "修图失败");
  }
};