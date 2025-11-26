export interface ImageData {
  base64: string;
  mimeType: string;
}

export enum Platform {
  DOUYIN = '抖音 (9:16)',
  XIAOHONGSHU = '小红书 (3:4)',
  BILIBILI = 'B站 (4:3)',
  YOUTUBE = 'YouTube (16:9)',
}

export interface GeneratorState {
  mainTitle: string;
  subTitle: string;
  platform: Platform;
  subjectImage: ImageData | null;
  styleImage: ImageData | null;
  customPrompt: string;
  selectedTags: string[];
}

export interface GenerationResult {
  imageUrl: string;
  base64: string;
  promptUsed: string;
}

export interface ApiError {
  message: string;
  details?: string;
}