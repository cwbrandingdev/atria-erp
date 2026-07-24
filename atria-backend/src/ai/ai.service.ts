import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ContentPlatform,
  ContentPostFormat,
} from '@prisma/client';

export interface BriefContentIdea {
  title: string;
  copy: string;
  format: ContentPostFormat;
  mediaConcept: string;
  suggestedDate: string;
}

export interface BriefContentPlan {
  summary: string;
  platform: ContentPlatform;
  ideas: BriefContentIdea[];
  provider: 'openai' | 'gemini' | 'fallback';
}

interface GeneratePlanInput {
  brief: string;
  clientName: string;
  platform?: ContentPlatform;
  objective?: string;
}

const VALID_FORMATS: ContentPostFormat[] = [
  ContentPostFormat.CAROUSEL,
  ContentPostFormat.REELS,
  ContentPostFormat.STATIC,
  ContentPostFormat.STORY,
];

const FORMAT_ROTATION: ContentPostFormat[] = [
  ContentPostFormat.CAROUSEL,
  ContentPostFormat.REELS,
  ContentPostFormat.STATIC,
  ContentPostFormat.STORY,
  ContentPostFormat.CAROUSEL,
];

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly config: ConfigService) {}

  async generateContentPlan(input: GeneratePlanInput): Promise<BriefContentPlan> {
    const platform = input.platform ?? ContentPlatform.INSTAGRAM;
    const openaiKey = this.config.get<string>('OPENAI_API_KEY');
    const geminiKey = this.config.get<string>('GEMINI_API_KEY');
    const provider = this.config.get<string>('AI_PROVIDER') ?? 'openai';

    if (provider === 'gemini' && geminiKey) {
      try {
        return await this.generateWithGemini(input, platform, geminiKey);
      } catch (error) {
        this.logger.warn(`Gemini failed, trying fallback: ${error}`);
      }
    }

    if (openaiKey) {
      try {
        return await this.generateWithOpenAI(input, platform, openaiKey);
      } catch (error) {
        this.logger.warn(`OpenAI failed, trying fallback: ${error}`);
      }
    }

    if (geminiKey && provider !== 'gemini') {
      try {
        return await this.generateWithGemini(input, platform, geminiKey);
      } catch (error) {
        this.logger.warn(`Gemini fallback failed: ${error}`);
      }
    }

    return this.generateFallbackPlan(input, platform);
  }

  private buildPrompt(input: GeneratePlanInput, platform: ContentPlatform) {
    const formats = VALID_FORMATS.join(', ');
    return `You are a senior social media strategist for a digital agency.
Parse the client brief below and generate a structured content plan.

Client: ${input.clientName}
Platform: ${platform}
${input.objective ? `Campaign objective: ${input.objective}` : ''}

Brief:
"""
${input.brief}
"""

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "summary": "1-2 sentence campaign summary in Portuguese",
  "ideas": [
    {
      "title": "Post title",
      "copy": "Full caption/copy draft in Portuguese with emojis where appropriate",
      "format": "one of: ${formats}",
      "mediaConcept": "Visual/production direction for designers",
      "suggestedDate": "ISO 8601 date-time string, spread across next 2-3 weeks on weekdays"
    }
  ]
}

Rules:
- Generate exactly 5 content ideas
- Vary formats across carousel, reels, static, story
- suggestedDate must be future dates, Mon-Fri preferred, 10:00 BRT
- All text in Brazilian Portuguese`;
  }

  private async generateWithOpenAI(
    input: GeneratePlanInput,
    platform: ContentPlatform,
    apiKey: string,
  ): Promise<BriefContentPlan> {
    const model =
      this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a JSON-only API. Respond with valid JSON matching the requested schema.',
          },
          { role: 'user', content: this.buildPrompt(input, platform) },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${body}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty OpenAI response');

    return this.parsePlanResponse(content, platform, 'openai');
  }

  private async generateWithGemini(
    input: GeneratePlanInput,
    platform: ContentPlatform,
    apiKey: string,
  ): Promise<BriefContentPlan> {
    const model =
      this.config.get<string>('GEMINI_MODEL') ?? 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: this.buildPrompt(input, platform) }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${body}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Empty Gemini response');

    return this.parsePlanResponse(content, platform, 'gemini');
  }

  private parsePlanResponse(
    raw: string,
    platform: ContentPlatform,
    provider: 'openai' | 'gemini',
  ): BriefContentPlan {
    const jsonText = this.extractJson(raw);
    const parsed = JSON.parse(jsonText) as {
      summary?: string;
      ideas?: Array<{
        title?: string;
        copy?: string;
        format?: string;
        mediaConcept?: string;
        suggestedDate?: string;
      }>;
    };

    const ideas = (parsed.ideas ?? [])
      .slice(0, 5)
      .map((idea, index) => this.normalizeIdea(idea, index));

    while (ideas.length < 5) {
      ideas.push(this.normalizeIdea({}, ideas.length));
    }

    return {
      summary: parsed.summary?.trim() || 'Plano de conteúdo gerado a partir do briefing.',
      platform,
      ideas,
      provider,
    };
  }

  private extractJson(raw: string): string {
    const trimmed = raw.trim();
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) return fenced[1].trim();
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
    return trimmed;
  }

  private normalizeIdea(
    idea: {
      title?: string;
      copy?: string;
      format?: string;
      mediaConcept?: string;
      suggestedDate?: string;
    },
    index: number,
  ): BriefContentIdea {
    const format = this.normalizeFormat(idea.format, index);
    const suggestedDate = this.normalizeDate(idea.suggestedDate, index);

    return {
      title: idea.title?.trim() || `Ideia de conteúdo ${index + 1}`,
      copy: idea.copy?.trim() || 'Copy a ser refinada pela equipe criativa.',
      format,
      mediaConcept:
        idea.mediaConcept?.trim() ||
        'Conceito visual alinhado à identidade da marca.',
      suggestedDate,
    };
  }

  private normalizeFormat(value: string | undefined, index: number): ContentPostFormat {
    const upper = value?.toUpperCase() as ContentPostFormat;
    if (VALID_FORMATS.includes(upper)) return upper;
    return FORMAT_ROTATION[index % FORMAT_ROTATION.length];
  }

  private normalizeDate(value: string | undefined, index: number): string {
    if (value) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime()) && parsed > new Date()) {
        return parsed.toISOString();
      }
    }
    return this.defaultScheduleDate(index).toISOString();
  }

  private defaultScheduleDate(index: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + (index + 1) * 3);
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    date.setHours(10, 0, 0, 0);
    return date;
  }

  private generateFallbackPlan(
    input: GeneratePlanInput,
    platform: ContentPlatform,
  ): BriefContentPlan {
    const briefSnippet = input.brief.trim().slice(0, 120);
    const themes = this.extractThemes(input.brief);

    const ideas: BriefContentIdea[] = Array.from({ length: 5 }, (_, index) => {
      const theme = themes[index % themes.length];
      const format = FORMAT_ROTATION[index];
      const scheduled = this.defaultScheduleDate(index);

      return {
        title: `${theme} — ${input.clientName}`,
        copy: this.buildFallbackCopy(theme, input.clientName, briefSnippet, format),
        format,
        mediaConcept: this.buildFallbackMediaConcept(theme, format),
        suggestedDate: scheduled.toISOString(),
      };
    });

    return {
      summary: `Plano de conteúdo para ${input.clientName} com foco em: ${themes.slice(0, 3).join(', ')}.`,
      platform,
      ideas,
      provider: 'fallback',
    };
  }

  private extractThemes(brief: string): string[] {
    const cleaned = brief
      .replace(/\s+/g, ' ')
      .split(/[.!?\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 12);

    if (cleaned.length >= 3) return cleaned.slice(0, 5);

    return [
      'Apresentação da marca',
      'Benefícios do produto',
      'Bastidores e processo',
      'Depoimento e prova social',
      'Chamada para ação',
    ];
  }

  private buildFallbackCopy(
    theme: string,
    clientName: string,
    briefSnippet: string,
    format: ContentPostFormat,
  ): string {
    const formatHint =
      format === ContentPostFormat.REELS
        ? '🎬 Vídeo curto e dinâmico'
        : format === ContentPostFormat.CAROUSEL
          ? '📸 Carrossel educativo'
          : format === ContentPostFormat.STORY
            ? '✨ Story interativo'
            : '📌 Post estático';

    return `${formatHint}\n\n${theme} — ${clientName}\n\n${briefSnippet}${briefSnippet.length >= 120 ? '...' : ''}\n\n👉 Saiba mais nos comentários ou no link da bio.\n\n#${clientName.replace(/\s+/g, '').toLowerCase()} #marketingdigital`;
  }

  private buildFallbackMediaConcept(
    theme: string,
    format: ContentPostFormat,
  ): string {
    const base = `Visual clean com cores da marca. Tema: ${theme}.`;
    switch (format) {
      case ContentPostFormat.REELS:
        return `${base} Vídeo vertical 9:16, cortes rápidos, legendas on-screen.`;
      case ContentPostFormat.CAROUSEL:
        return `${base} 5 slides: capa impactante + 3 pontos-chave + CTA final.`;
      case ContentPostFormat.STORY:
        return `${base} Sequência de 3 stories com sticker de enquete ou link.`;
      default:
        return `${base} Imagem estática com tipografia forte e CTA visível.`;
    }
  }
}
