import React from 'react';
import '../styles/TechStack.css';

export default function TechStack() {
  return (
    <div className="tech-stack-container">
      <h1>Tech Stack & Architecture</h1>

      {/* Tech Stack Paragraph */}
      <section className="tech-overview">
        <h2>How It's Built</h2>
        <p>
          FitVision uses a modern full-stack architecture with React and Vite on the frontend to provide a responsive user interface for browsing clothing and uploading photos. The backend is built with Flask and SQLAlchemy, which handles user authentication via JWT tokens and bcrypt password hashing, manages the product catalog through REST API endpoints, and orchestrates asynchronous try-on jobs using background threading. PostgreSQL serves as the persistent database layer, storing user accounts, product metadata, and try-on job history. For external integrations, the app fetches clothing items from DummyJSON's free product API, leverages Hugging Face Spaces to run AI models (IDM-VTON for tops and OOTDiffusion for dresses) that generate photorealistic try-on images, and uses Cloudinary for cloud-based image storage and CDN delivery. The entire stack is deployed on Render—the backend runs as a Python web service via Gunicorn, the frontend is built and served as a static site, and the PostgreSQL database is managed by Render—resulting in a fully cloud-hosted application with zero local server dependencies.
        </p>
      </section>

      {/* Information Flow Diagram */}
      <section className="architecture-section">
        <h2>Information Flow and Data Model Diagram</h2>
        <div className="diagram-container">
          <p className="diagram-title">System Architecture</p>
          <pre className="mermaid">{`flowchart TB
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
    FE -->|"poll job status (3s)"| BE`}</pre>
        </div>
      </section>

      {/* Try-On Sequence */}
      <section className="sequence-section">
        <h2>Try-On Process Sequence</h2>
        <p className="diagram-subtitle">How a single try-on request flows through the system:</p>
        <div className="diagram-container">
          <pre className="mermaid">{`sequenceDiagram
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
    FE-->>U: show try-on image`}</pre>
        </div>
      </section>

      {/* Data Model */}
      <section className="data-model-section">
        <h2>Database Schema</h2>
        <div className="schema-container">
          <div className="schema-table">
            <h3>users</h3>
            <ul>
              <li><strong>id</strong> — UUID primary key</li>
              <li><strong>email</strong> — unique, required</li>
              <li><strong>password_hash</strong> — bcrypt hashed</li>
              <li><strong>created_at</strong> — timestamp</li>
            </ul>
          </div>

          <div className="schema-table">
            <h3>products</h3>
            <ul>
              <li><strong>id</strong> — UUID primary key</li>
              <li><strong>external_id</strong> — DummyJSON product ID</li>
              <li><strong>title</strong>, <strong>brand</strong>, <strong>price</strong></li>
              <li><strong>image_url</strong> — product image URL</li>
              <li><strong>category</strong> — indexed (tops, dresses, etc.)</li>
              <li><strong>raw_data</strong> — JSON API response</li>
              <li><strong>cached_at</strong> — TTL: 1 hour</li>
            </ul>
          </div>

          <div className="schema-table">
            <h3>tryon_jobs</h3>
            <ul>
              <li><strong>id</strong> — UUID primary key</li>
              <li><strong>user_id</strong> — FK → users (cascade delete)</li>
              <li><strong>product_id</strong> — FK → products (SET NULL)</li>
              <li><strong>person_image_url</strong> — Cloudinary URL</li>
              <li><strong>garment_image_url</strong> — Cloudinary URL</li>
              <li><strong>status</strong> — PENDING / PROCESSING / DONE / FAILED</li>
              <li><strong>result_url</strong> — generated image Cloudinary URL</li>
              <li><strong>error_message</strong> — if failed</li>
              <li><strong>created_at</strong>, <strong>completed_at</strong> — timestamps</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack Summary */}
      <section className="stack-summary">
        <h2>Technology Summary</h2>
        <div className="stack-grid">
          <div className="stack-item">
            <h3>Frontend</h3>
            <p>React 18 + Vite + React Router + Axios</p>
          </div>
          <div className="stack-item">
            <h3>Backend</h3>
            <p>Flask + SQLAlchemy + JWT + bcrypt + Gunicorn</p>
          </div>
          <div className="stack-item">
            <h3>Database</h3>
            <p>PostgreSQL (Render managed)</p>
          </div>
          <div className="stack-item">
            <h3>Storage</h3>
            <p>Cloudinary (image upload & CDN)</p>
          </div>
          <div className="stack-item">
            <h3>APIs</h3>
            <p>DummyJSON (catalog) + Hugging Face (try-on) + Cloudinary</p>
          </div>
          <div className="stack-item">
            <h3>Deployment</h3>
            <p>Render (100% free tier)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
