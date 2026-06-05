import { GeminiService } from './src/domains/ai/ai.service.js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function testGemini() {
  console.log('Testing Gemini Integration...');
  const aiService = new GeminiService();
  
  try {
    const result = await aiService.generateContent({
      prompt: 'Benefits of using Neo-brutalism in web design',
      tone: 'witty',
      platform: 'LinkedIn'
    });
    
    console.log('--- GENERATED CONTENT ---');
    console.log(result);
    console.log('---------------------------');
  } catch (error) {
    console.error('Test Failed:', error);
  }
}

testGemini();
