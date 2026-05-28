# FitVision — Demo Deliverables

## Architecture Diagram

> Renders automatically on GitHub. To export an image: paste into
> https://mermaid.live and download as PNG/SVG for slides.

```mermaid
flowchart TB
    User([User / Browser])

    subgraph Render["☁️ Render (cloud hosting)"]
        FE["React + Vite<br/>(static site)"]
        BE["Flask API<br/>(Gunicorn)"]
        DB[("PostgreSQL<br/>users · products · tryon_jobs")]
    end

    subgraph Free["🆓 Free external services"]
        CLOUD["Cloudinary<br/>image storage + CDN"]
        CAT["DummyJSON<br/>product catalog"]
        HF["Hugging Face Spaces<br/>IDM-VTON (tops)<br/>OOTDiffusion (dresses)"]
    end

    User -->|HTTPS| FE
    FE -->|"/api  (JWT auth)"| BE
    BE -->|SQLAlchemy| DB
    BE -->|"upload photo / store result"| CLOUD
    BE -->|"search & browse garments"| CAT
    BE -.->|"background worker<br/>(gradio_client)"| HF
    HF -.->|generated image| BE
    FE -->|"poll job status (3s)"| BE
```

## Try-On Sequence (how one try-on works)

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React
    participant BE as Flask API
    participant C as Cloudinary
    participant HF as HF Space
    participant DB as Postgres

    U->>FE: upload photo + pick garment
    FE->>BE: POST /api/uploads/person
    BE->>C: store photo
    C-->>BE: image URL
    FE->>BE: POST /api/tryon/generate
    BE->>DB: create job (PENDING)
    BE-->>FE: 202 + job_id
    Note over BE,HF: background thread
    BE->>HF: person + garment (gradio_client)
    HF-->>BE: generated image
    BE->>C: store result
    BE->>DB: job DONE + result URL
    loop every 3s
        FE->>BE: GET /api/tryon/jobs/{id}
        BE-->>FE: status (+ result when done)
    end
    FE-->>U: show try-on image
```

## 30-Second Elevator Pitch

> FitVision is an AI virtual fitting room. You upload one photo of yourself,
> pick a piece of clothing from a live catalog, and the app generates a
> photorealistic image of you actually wearing it — in seconds. It's full-stack:
> a React frontend, a Flask API with secure user accounts, cloud image storage,
> and open-source AI try-on models, all running on a zero-cost cloud stack.
> The goal is simple — let people see how something looks on *them* before they buy.

*(~75 words ≈ 30 seconds at a natural pace.)*

## Tech Stack (one-liner for slides)

React + Vite · Flask + SQLAlchemy + JWT · PostgreSQL · Cloudinary · DummyJSON ·
Hugging Face (IDM-VTON / OOTDiffusion) · deployed on Render — **100% free tier.**
