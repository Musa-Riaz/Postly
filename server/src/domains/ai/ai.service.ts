import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService, GenerateOptions } from './ai.entity.js';

export class GeminiService implements AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateContent(options: GenerateOptions): Promise<string> {
    const { prompt, tone, platform } = options;
    
    const systemPrompt = `You are an expert social media manager. Create a high-engaging post for ${platform || 'social media'}.
    Tone: ${tone || 'professional'}.
    User Prompt: ${prompt}
    
    Return ONLY the post content. Include emojis and relevant hashtags if appropriate.`;

    try {
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Generation Error:', error);
      throw new Error('Failed to generate content with AI');
    }
  }
}
