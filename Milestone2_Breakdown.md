# Milestone 2 Breakdown: AI Chat & Post Composer

This document provides a detailed breakdown of the features and functionalities to be implemented in Milestone 2.

## 1. AI Post Assistant (AI Chat)
The AI Assistant lives in a sidebar within the Composer and helps users brainstorm, write, and refine content.

### Key Functionalities:
- **Idea Generation**: "Give me 5 ideas for a post about a new product launch."
- **Content Refinement**: "Make this post sound more professional" or "Add relevant hashtags."
- **Context Awareness**: The AI is aware of the user's connected social platforms and can suggest platform-specific optimizations.
- **Tone Adjuster**: Quick buttons to change content tone (Professional, Witty, Casual, Informational).
- **Direct Application**: One-click button to push AI-generated content directly into the Composer.

### Technical Implementation:
- **Streaming API**: Use Server-Sent Events (SSE) or simple streaming for real-time AI responses.
- **LLM Integration**: Vercel AI SDK or direct integration with Gemini/OpenAI.
- **Conversation History**: Local state management for the current session's chat.

---

## 2. Multi-Platform Post Composer
A centralized hub for crafting content that looks great across all social networks.

### Key Functionalities:
- **Rich Text Editor (TiPtap)**:
  - Support for bold, italic, lists, and links.
  - Character counters that adjust based on the selected platform limits (e.g., 280 for X, 3000 for LinkedIn).
- **Unified Media Management**:
  - Drag-and-drop upload for images and videos.
  - Multi-file support.
- **Live Previews**:
  - **LinkedIn**: Show how the post appears with "See more" truncation.
  - **Instagram**: Focus on image/carousel aspect ratios.
  - **X (Twitter)**: Precise thread simulation and character limit warnings.
- **Platform-Specific Overrides**:
  - Write a "Master" caption and then customize it for specific platforms without affecting the others.
- **Drafting System**:
  - Automatic saving of progress.
  - Retrieval of existing drafts from the dashboard.

---

## 3. UI/UX Design (Neo-brutalism)
- **Bold Borders**: 2px or 3px black borders on all input fields and cards.
- **High Contrast**: Sharp white backgrounds with accent colors like #FFD600 (Yellow) or #A1FF00 (Lime Green).
- **Hard Shadows**: Box-shadows with 0 blur and 4px-8px offset.
- **Interactive States**: Pronounced hover effects and active states for buttons and tabs.

---

## 4. Development Phases

### Phase 1: Backend Scaffolding
- Implement `posts` and `ai` domains.
- Update Prisma schema for platform-specific content overrides.
- Set up media upload endpoints (Supabase Storage).

### Phase 2: AI Integration
- Connect to LLM provider.
- Implement streaming chat endpoint.
- Build the `AIChatSidebar` frontend component.

### Phase 3: Core Composer
- Integrate Tiptap editor.
- Build the media staging area.
- Implement the "Save Draft" logic.

### Phase 4: Dynamic Previews & Customization
- Build platform-specific preview layers.
- Implement the logic for overriding "Master" content with platform-specific captions.
