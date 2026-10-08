# AI-Powered Power BI Business Analytics Assistant

An enterprise-grade full-stack web application combining **React**, **Django REST Framework**, **Supabase PostgreSQL**, **Microsoft Power BI REST API**, and **LLMs (AI Orchestration & Text-to-SQL)** to provide real-time business intelligence and natural language analytics.

## 🏗️ System Architecture

```text
                    USER
                      │
                      ▼
                React Frontend (Vite + Tailwind)
                      │
                    Axios
                      │
                      ▼
            Django REST Framework API
                      │
               AI Orchestrator
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
  Supabase        Power BI         LLM API
 PostgreSQL      Analytics     (OpenAI / Gemini)
       │              │              │
       └──────────────┼──────────────┘
                      ▼
              Django Backend
                      │
                      ▼
               React Frontend (Answer + Charts)
```

## 📁 Repository Structure

```text
.
├── backend/            # Django + DRF application
│   ├── config/         # Root Django settings & URL routing
│   ├── accounts/       # User authentication & JWT
│   ├── analytics/      # Business metrics & Sales data
│   ├── ai/             # AI Orchestrator & Text-to-SQL engine
│   ├── powerbi/        # Power BI REST API & Embedding service
│   └── requirements.txt
├── frontend/           # React + Vite + Tailwind CSS application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages (Dashboard, Chat, PowerBI)
│   │   ├── services/   # Axios API client & endpoints
│   │   ├── hooks/      # Custom React hooks
│   │   └── context/    # React Context (Auth, Global State)
│   └── package.json
├── .env.example        # Environment variable template
└── README.md
```
