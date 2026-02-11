import { Priority, Identity } from './types/priority';

const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_API_URL = process.env.AI_API_URL || 'https://api.anthropic.com/v1/messages';

interface AIFeedbackResult {
  priorityAnalysis: string;
  goalFeedback: string;
  suggestions: string;
  identityInsights: string;
  overallWisdom: string;
}

function buildPrompt(priorities: Priority[], identity: Identity): string {
  const priorityList = priorities
    .filter(p => p.name.trim())
    .map((p, i) => {
      const goals = p.goals
        .filter(g => g.what.trim())
        .map((g, j) => `    Goal ${j + 1}: ${g.what} (by ${g.byWhen || 'not set'}) - Success: ${g.successLooksLike || 'not defined'}`)
        .join('\n');
      return `  ${i + 1}. ${p.name} — Why: ${p.why || 'not stated'}\n${goals}`;
    })
    .join('\n\n');

  const identitySection = [
    identity.iAmSomeoneWho && `Identity Statement: "${identity.iAmSomeoneWho}"`,
    identity.habitsToBuild && `Habits to Build: ${identity.habitsToBuild}`,
    identity.habitsToEliminate && `Habits to Eliminate: ${identity.habitsToEliminate}`,
    identity.beliefsToHold && `Beliefs to Hold: ${identity.beliefsToHold}`,
    identity.personWhoAchieves && `Person Who Achieves: ${identity.personWhoAchieves}`,
  ].filter(Boolean).join('\n');

  return `You are a wise life coach reviewing someone's 2026 annual blueprint. Provide thoughtful, personalized feedback.

Here is their blueprint:

PRIORITIES AND GOALS:
${priorityList}

IDENTITY TRANSFORMATION:
${identitySection}

Please provide feedback in exactly 5 sections. Be specific, reference their actual priorities and goals, and be encouraging but honest. Each section should be 2-4 paragraphs.

1. PRIORITY ANALYSIS: Analyze how well their priorities are defined and ordered. Are they balanced? Do they cover important life areas? Are any critical areas missing?

2. GOAL FEEDBACK: Review their specific goals under each priority. Are they SMART (Specific, Measurable, Achievable, Relevant, Time-bound)? Which goals are strongest? Which need refinement?

3. SUGGESTIONS: Provide concrete suggestions for improvement or refinement. What could they add, change, or reconsider?

4. IDENTITY INSIGHTS: Analyze their identity transformation section. Does their identity statement align with their priorities? Are their habits well-chosen to support their goals?

5. OVERALL WISDOM: High-level guidance, encouragement, and wisdom for their journey ahead.

Respond in JSON format:
{
  "priorityAnalysis": "...",
  "goalFeedback": "...",
  "suggestions": "...",
  "identityInsights": "...",
  "overallWisdom": "..."
}`;
}

function generatePlaceholderFeedback(priorities: Priority[], identity: Identity): AIFeedbackResult {
  const priorityNames = priorities.filter(p => p.name.trim()).map(p => p.name);
  const goalCount = priorities.reduce((sum, p) => sum + p.goals.filter(g => g.what.trim()).length, 0);

  return {
    priorityAnalysis: `You've identified ${priorityNames.length} priorities for 2026: ${priorityNames.join(', ')}. This shows thoughtful consideration of what matters most to you.\n\nA strong set of priorities covers multiple life dimensions — consider whether you're balancing personal growth, relationships, career, and wellbeing. The order you've chosen reflects your current values, and it's worth revisiting this ranking quarterly to see if it still resonates.`,
    goalFeedback: `You've set ${goalCount} goals across your priorities. Each goal should answer: What specifically will I achieve? How will I know I've succeeded? By when?\n\nReview each goal and ask yourself: "If I showed this to a stranger, would they know exactly what success looks like?" The more specific your goals, the more likely you are to achieve them. Consider adding measurable milestones to track progress throughout the year.`,
    suggestions: `Here are some suggestions to strengthen your blueprint:\n\n1. For each priority, ensure you have at least one goal with a Q1 milestone — this creates immediate momentum.\n2. Consider adding an accountability mechanism — who will you share these goals with?\n3. Schedule a monthly review (15 minutes) to check your progress against milestones.\n4. Identify potential obstacles for your top 3 goals and pre-plan how you'll handle them.`,
    identityInsights: identity.iAmSomeoneWho
      ? `Your identity statement "${identity.iAmSomeoneWho}" is a powerful anchor. The key insight of identity-based change is that lasting transformation comes from who you become, not just what you do.\n\nEnsure your daily habits directly reinforce this identity. Every small action is a vote for the person you're becoming.`
      : `Consider adding an identity statement — "I am someone who..." — that captures the person who naturally achieves these goals. Identity-based change is the most sustainable form of transformation.`,
    overallWisdom: `Your 2026 Blueprint reflects genuine intention and self-awareness. The fact that you've taken the time to define your priorities and set goals puts you ahead of most people.\n\nRemember: a plan is a living document. The value isn't in perfection — it's in having a direction. Review this blueprint monthly, celebrate small wins, and don't be afraid to adjust as you grow. The person you'll be at the end of 2026 will be grateful you took this step today.\n\nStay consistent, stay patient, and trust the process.`,
  };
}

export async function generateAIFeedback(
  priorities: Priority[],
  identity: Identity
): Promise<AIFeedbackResult> {
  // If no API key is configured, return placeholder feedback
  if (!AI_API_KEY) {
    console.log('AI_API_KEY not set — using placeholder feedback');
    return generatePlaceholderFeedback(priorities, identity);
  }

  try {
    const prompt = buildPrompt(priorities, identity);

    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status, await response.text());
      return generatePlaceholderFeedback(priorities, identity);
    }

    const result = await response.json();
    const content = result.content?.[0]?.text;

    if (!content) {
      return generatePlaceholderFeedback(priorities, identity);
    }

    // Parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return generatePlaceholderFeedback(priorities, identity);
    }

    const parsed = JSON.parse(jsonMatch[0]) as AIFeedbackResult;

    // Validate all fields exist
    if (!parsed.priorityAnalysis || !parsed.goalFeedback || !parsed.suggestions ||
        !parsed.identityInsights || !parsed.overallWisdom) {
      return generatePlaceholderFeedback(priorities, identity);
    }

    return parsed;
  } catch (error) {
    console.error('AI feedback generation failed:', error);
    return generatePlaceholderFeedback(priorities, identity);
  }
}
