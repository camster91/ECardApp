'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

const EVENT_TYPES = [
  'Birthday',
  'Wedding',
  'Baby Shower',
  'Graduation',
  'Corporate Event',
  'Holiday Party',
  'Dinner Party',
  'Anniversary',
  'Other',
] as const;

const STYLES = [
  { label: 'Elegant & Sophisticated', keywords: 'luxurious textures, refined typography spacing, subtle metallic accents, and a sophisticated color harmony' },
  { label: 'Playful & Fun', keywords: 'cheerful illustrations, rounded shapes, confetti-like elements, and lively bursts of color' },
  { label: 'Modern & Minimalist', keywords: 'clean geometric shapes, generous whitespace, sharp lines, and a restrained color palette' },
  { label: 'Rustic & Bohemian', keywords: 'natural textures like wood grain and linen, hand-drawn botanical elements, and warm earthy tones' },
  { label: 'Vintage & Retro', keywords: 'ornate borders, aged paper textures, classic motifs, and a nostalgic muted color scheme' },
  { label: 'Floral & Garden', keywords: 'lush watercolor flowers, leafy greenery borders, soft gradients, and delicate botanical arrangements' },
  { label: 'Bold & Dramatic', keywords: 'high-contrast colors, strong geometric compositions, striking visual weight, and powerful graphic elements' },
  { label: 'Tropical & Vibrant', keywords: 'exotic foliage, bright saturated colors, palm leaves, monstera patterns, and sun-drenched warmth' },
] as const;

interface PromptForm {
  eventType: string;
  style: string;
  colors: string;
  extras: string;
  orientation: 'portrait' | 'landscape';
}

function buildPrompt(form: PromptForm): string {
  const styleObj = STYLES.find((s) => s.label === form.style);
  const dims = form.orientation === 'portrait' ? '1080×1350' : '1200×630';

  let prompt = `Create a ${form.style.toLowerCase()} digital invitation card design for a ${form.eventType.toLowerCase()}.

Design specifications:
- Dimensions: ${dims}px, ${form.orientation} orientation
- Color palette: ${form.colors || 'designer\'s choice'}
- Style: ${styleObj?.keywords || form.style.toLowerCase()}`;

  if (form.extras.trim()) {
    prompt += `\n- Special elements: ${form.extras.trim()}`;
  }

  prompt += `

IMPORTANT: Do NOT include any text, words, letters, or numbers on the design. Leave clean space where text can be overlaid later. The design should be purely decorative/illustrative.

The invitation should feel premium and visually striking, suitable for digital delivery. Use a polished composition with ${styleObj?.keywords || 'attention to detail'}. Output as a high-quality image.`;

  return prompt;
}

export default function AIPromptGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<PromptForm>({
    eventType: EVENT_TYPES[0],
    style: STYLES[0].label,
    colors: '',
    extras: '',
    orientation: 'portrait',
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const updateField = useCallback(<K extends keyof PromptForm>(key: K, value: PromptForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setGeneratedPrompt(null);
    setCopied(false);
  }, []);

  const handleGenerate = () => {
    setGeneratedPrompt(buildPrompt(form));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = generatedPrompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) {
        setCopied(true);
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
        Generate AI Prompt
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-b from-indigo-50/80 to-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-indigo-900">AI Prompt Generator</h3>
          <p className="mt-0.5 text-xs text-indigo-700">
            Build a prompt, then paste it into ChatGPT or Gemini to generate your design.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close AI prompt generator"
          onClick={() => setIsOpen(false)}
          className="rounded-md p-1 text-indigo-400 transition-colors hover:bg-indigo-100 hover:text-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Event Type */}
        <div>
          <label htmlFor="ai-event-type" className="block text-xs font-medium text-gray-700">
            Event Type
          </label>
          <select
            id="ai-event-type"
            value={form.eventType}
            onChange={(e) => updateField('eventType', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div>
          <label htmlFor="ai-style" className="block text-xs font-medium text-gray-700">
            Style / Mood
          </label>
          <select
            id="ai-style"
            value={form.style}
            onChange={(e) => updateField('style', e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            {STYLES.map((s) => (
              <option key={s.label} value={s.label}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Colors */}
        <div>
          <label htmlFor="ai-colors" className="block text-xs font-medium text-gray-700">
            Color Palette
          </label>
          <input
            id="ai-colors"
            type="text"
            value={form.colors}
            onChange={(e) => updateField('colors', e.target.value)}
            placeholder="e.g. gold and navy blue"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Extras */}
        <div>
          <label htmlFor="ai-extras" className="block text-xs font-medium text-gray-700">
            Special Elements <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="ai-extras"
            type="text"
            value={form.extras}
            onChange={(e) => updateField('extras', e.target.value)}
            placeholder="e.g. roses, star patterns"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Orientation toggle */}
      <div className="mt-4">
        <span id="orientation-label" className="block text-xs font-medium text-gray-700">Orientation</span>
        <div className="mt-1.5 flex gap-2" role="radiogroup" aria-labelledby="orientation-label">
          <button
            type="button"
            role="radio"
            aria-checked={form.orientation === 'portrait'}
            onClick={() => updateField('orientation', 'portrait')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              form.orientation === 'portrait'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Portrait (1080&times;1350)
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={form.orientation === 'landscape'}
            onClick={() => updateField('orientation', 'landscape')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              form.orientation === 'landscape'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Landscape (1200&times;630)
          </button>
        </div>
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={handleGenerate}
        className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Generate Prompt
      </button>

      {/* Output */}
      {generatedPrompt && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-800">
              {generatedPrompt}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                copied
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy Prompt
                </>
              )}
            </button>
            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Open ChatGPT
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Open Gemini
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
