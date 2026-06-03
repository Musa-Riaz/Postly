export interface GenerateOptions {
  prompt: string;
  tone?: string;
  platform?: string;
}

export interface AIService {
  generateContent(options: GenerateOptions): Promise<string>;
}
