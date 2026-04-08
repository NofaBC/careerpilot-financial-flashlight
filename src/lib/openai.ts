import OpenAI from 'openai';

// Server-only — never import this in client components
let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _client;
}

export interface InsightInput {
  todayRevenue: number;
  todayCost: number;
  todayProfit: number;
  weekRevenue: number;
  weekCost: number;
  weekProfit: number;
  monthRevenue: number;
  monthCost: number;
  monthProfit: number;
  monthNewSubs: number;
  monthRenewals: number;
  costPercentage: number;
}

export async function generateInsight(metrics: InsightInput): Promise<string> {
  const prompt = `You are a concise internal financial analyst for a SaaS product called CareerPilot AI.

Given these summarized metrics, provide 2-3 short observations or insights. Focus on:
- Cost trends or spikes
- Revenue vs cost relationship
- Subscriber patterns
- Any noteworthy patterns

Do NOT invent specific numbers. Only reference the numbers provided. Keep it under 150 words.

Metrics:
- Today: Revenue $${metrics.todayRevenue.toFixed(2)}, Cost $${metrics.todayCost.toFixed(2)}, Profit $${metrics.todayProfit.toFixed(2)}
- This Week: Revenue $${metrics.weekRevenue.toFixed(2)}, Cost $${metrics.weekCost.toFixed(2)}, Profit $${metrics.weekProfit.toFixed(2)}
- This Month: Revenue $${metrics.monthRevenue.toFixed(2)}, Cost $${metrics.monthCost.toFixed(2)}, Profit $${metrics.monthProfit.toFixed(2)}
- Month Subscribers: ${metrics.monthNewSubs} new, ${metrics.monthRenewals} renewals
- Cost as % of Revenue: ${metrics.costPercentage.toFixed(1)}%`;

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.4,
  });

  return response.choices[0]?.message?.content?.trim() || 'No insights available.';
}
