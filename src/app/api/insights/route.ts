import { NextRequest, NextResponse } from 'next/server';
import { generateInsight, InsightInput } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate that we received numeric metrics
    const metrics: InsightInput = {
      todayRevenue: Number(body.todayRevenue) || 0,
      todayCost: Number(body.todayCost) || 0,
      todayProfit: Number(body.todayProfit) || 0,
      weekRevenue: Number(body.weekRevenue) || 0,
      weekCost: Number(body.weekCost) || 0,
      weekProfit: Number(body.weekProfit) || 0,
      monthRevenue: Number(body.monthRevenue) || 0,
      monthCost: Number(body.monthCost) || 0,
      monthProfit: Number(body.monthProfit) || 0,
      monthNewSubs: Number(body.monthNewSubs) || 0,
      monthRenewals: Number(body.monthRenewals) || 0,
      costPercentage: Number(body.costPercentage) || 0,
    };

    const insight = await generateInsight(metrics);

    return NextResponse.json({ insight });
  } catch (error) {
    console.error('Insight generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    );
  }
}
