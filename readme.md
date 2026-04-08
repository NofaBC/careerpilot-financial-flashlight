# CareerPilot AI – Financial Flashlight

CareerPilot AI – Financial Flashlight is a lightweight internal financial tracking dashboard built to monitor the daily revenue, expenses, profit, and performance trends of CareerPilot AI before NOFA Command Core™ is fully developed.

Its purpose is to provide fast, practical financial visibility so decisions can be made from real numbers instead of assumptions. This tool is designed to help track business health closely during the early operating stage, especially while API usage, operating costs, and revenue patterns are still being actively watched.

## Purpose

This tool provides immediate visibility into:

- Daily revenue
- Refunds
- API and operational costs
- Daily profit
- Weekly performance
- Monthly performance
- Revenue trends
- Cost trends
- Profitability patterns

It is intentionally simple, fast, and operational.

This is **not** a full accounting platform. It is an internal financial control tool — a “financial flashlight” — meant to help keep CareerPilot AI financially clear, disciplined, and profitable.

## Current Scope

Version 1 is focused on:

- Manual financial data entry
- Automatic calculation of:
  - Net revenue
  - Total cost
  - Daily profit
  - Weekly totals
  - Monthly totals
  - Revenue per subscriber
  - Cost as a percentage of revenue
- Viewing saved financial entries
- Tracking notes tied to specific days
- Reviewing financial performance in a lightweight dashboard

## Planned Stack

This project is intended to run on:

- **GitHub** for source control
- **Vercel** for deployment
- **Firebase Auth** for internal access control
- **Firestore** for persistent financial records
- **OpenAI API** for optional financial insights and summaries

## Architecture Principles

The core financial calculations must remain deterministic.

That means:

- Revenue math is calculated by code, not AI
- Cost math is calculated by code, not AI
- Profit math is calculated by code, not AI
- Weekly and monthly rollups are calculated by code, not AI

OpenAI should only be used as an **insight layer** for things like:

- Explaining cost spikes
- Summarizing weekly performance
- Highlighting trends
- Noticing possible anomalies
- Providing operational observations

AI should **not** be treated as the source of truth for the numbers.

## Core Dashboard Sections

The dashboard should preserve and support these main sections:

1. **Hero / Overview**
   - Tool name
   - Internal dashboard description
   - Internal utility badge

2. **Today Metrics**
   - Today net revenue
   - Today total cost
   - Today profit
   - Month net profit snapshot

3. **Week Metrics**
   - This week revenue
   - This week cost
   - This week profit

4. **Daily Entry Form**
   - Date
   - New subscribers
   - Renewals
   - Total revenue
   - Refunds
   - AI API cost
   - Jobs API cost
   - Hosting / infrastructure cost
   - Other costs
   - Notes

5. **Month Snapshot**
   - Month revenue
   - Month cost
   - Month new subscribers
   - Month renewals
   - Revenue per subscriber
   - Cost percentage of revenue

6. **Saved Entries Table**
   - Historical daily entries
   - Quick review of notes and financial trends

## Data Model

Each daily record should support fields such as:

- `date`
- `newSubs`
- `renewals`
- `revenue`
- `refunds`
- `aiCost`
- `jobsCost`
- `hostingCost`
- `otherCost`
- `notes`
- `createdAt`
- `updatedAt`
- `createdBy`

## Project Goals

The immediate goal is to create a reliable internal dashboard that gives clear financial awareness each day.

The broader long-term goal is for this tool to evolve into or integrate with:

- **NOFA Command Core™** for centralized intelligence and control
- **API Sentinel AI™** for API monitoring and cost control
- **AffiliateLedger AI™** for affiliate revenue tracking

## Build Priorities

The recommended build order is:

1. Set up the repo and project structure
2. Deploy the app to Vercel
3. Connect Firebase Auth
4. Connect Firestore
5. Replace local storage with persistent database records
6. Protect access to internal users only
7. Add optional AI insight generation through a secure backend route
8. Expand with charts, reserve tracking, Stripe fee tracking, and retained cash logic later

## What This Tool Is Not

This tool is not meant to be:

- A full accounting system
- A tax reporting system
- A bookkeeping replacement
- A payroll system
- An AI-dependent dashboard

It is a focused operational finance dashboard for internal use.

## Development Notes

When building or expanding this app:

- Keep the UX fast and simple
- Preserve clarity over complexity
- Avoid unnecessary features in v1
- Keep financial logic transparent
- Keep AI optional, never required
- Treat security and credential handling seriously
- Never expose private API keys in the frontend

## Internal Use

This project is intended for internal use by NOFA AI Factory and CareerPilot AI operations.

## Status

Initial planning and architecture defined.  
Current goal: migrate the existing dashboard into a production-ready internal app using GitHub, Vercel, Firebase, and secure server-side AI insights.
