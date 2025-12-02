export interface Prompt {
  slug: string;
  title: string;
  description: string;
  category: "coding" | "writing" | "image-gen";
  tags: string[];
  content: string;
  author?: string;
}

export const categories = [
  { id: "all", name: "All Prompts" },
  { id: "coding", name: "Coding Guru" },
  { id: "writing", name: "Creative Writing" },
  { id: "image-gen", name: "Visual Art" },
];

export const prompts: Prompt[] = [
  {
    slug: "react-component-generator",
    title: "React Component Master",
    description: "Generate production-ready React components with Tailwind CSS and TypeScript.",
    category: "coding",
    tags: ["React", "Tailwind", "TypeScript"],
    content: `
# React Component Generator

You are an expert React developer. Your task is to generate a production-ready functional component.

## Component Architecture

This diagram shows the data flow within the component:

\`\`\`mermaid
graph TD
    A[User Interaction] -->|Triggers| B(Event Handler)
    B -->|Updates| C{State Change}
    C -->|Yes| D[Re-render UI]
    C -->|No| E[No Action]
    D --> F[Tailwind Styles Applied]
\`\`\`

## Component Flow

\`\`\`mermaid
sequenceDiagram
    User->>Component: Interacts (Click/Type)
    Component->>State: Updates State
    State->>UI: Re-renders
    Component->>API: Fetches Data (useEffect)
    API-->>Component: Returns Data
    Component-->>User: Displays Data
\`\`\`

## Requirements

1. Use **TypeScript** interfaces for props.
2. Use **Tailwind CSS** for styling.
3. Implement responsive design.
4. Handle loading and error states.

## Template Code

\`\`\`tsx
import React from 'react';

interface ComponentProps {
  title: string;
  isActive?: boolean;
}

export const ModernComponent: React.FC<ComponentProps> = ({ 
  title, 
  isActive = false 
}) => {
  return (
    <div className={\`p-6 rounded-xl transition-all \${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100'}\`}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 opacity-80">This is a production-ready component.</p>
    </div>
  );
};
\`\`\`

Requirements: [User Input Requirements]`,
  },
  {
    slug: "cyberpunk-story-teller",
    title: "Cyberpunk Narrator",
    description: "Weave intricate cyberpunk narratives with neon-soaked atmosphere.",
    category: "writing",
    tags: ["Sci-Fi", "Storytelling", "Atmosphere"],
    content: `
# Cyberpunk Narrative Generator

Act as a cyberpunk novelist in the style of William Gibson.

## Scene Elements

- **Lighting**: Neon, holographic, rain-slicked
- **Atmosphere**: Oppressive, high-tech, low-life
- **Tech**: Cyberdecks, neural links, drones

## Plot Structure

\`\`\`mermaid
journey
    title The Heist
    section Planning
      Meet Fixer: 5: Fixer
      Hack Database: 3: Hacker
    section Execution
      Infiltrate Corp: 4: Solo
      Steal Data: 5: Netrunner
    section Escape
      Drone Chase: 2: Driver
      Safehouse: 5: Team
\`\`\`

Write a scene set in [Location].
Start with a sensory description of the smell of the air.`,
  },
  {
    slug: "midjourney-photorealism",
    title: "MJ V6 Photorealism",
    description: "Create hyper-realistic portrait photography prompts for Midjourney V6.",
    category: "image-gen",
    tags: ["Midjourney", "Photography", "Portrait"],
    content: `Street photography portrait of a [Subject], shot on 35mm Kodak Portra 400, 
natural lighting, cinematic composition, highly detailed skin texture, 
depth of field --ar 3:2 --v 6.0 --style raw`,
  },
];
