export type CognitiveStyle = 'default' | 'concise' | 'learning' | 'explanatory' | 'proactive';

export interface StyleDefinition {
  id: CognitiveStyle;
  name: string;
  label: string;
  description: string;
  slashCommand: string;
  iconName: 'Sparkles' | 'Zap' | 'GraduationCap' | 'BookOpen' | 'Rocket';
  tag: string;
  color: string;
  directive: string;
}

export interface SlashStyleDetectionResult {
  cleanText: string;
  detectedStyle: CognitiveStyle | null;
  hadSlashCommand: boolean;
}
