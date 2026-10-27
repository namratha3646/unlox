
import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [language, setLanguage] = useState("English");
  const [duration, setDuration] = useState("60");
  const [lesson, setLesson] = useState(null);
  const [source, setSource] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateLesson(event) {
    event.preventDefault();

    if (topic.trim().length < 2) {
      setError("Please enter a topic with at least 2 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setWarning("");
    setLesson(null);

    try {
      const response = await fetch(`${API_URL}/api/lesson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          level,
          language,
          duration_seconds: Number(duration),
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned error ${response.status}`);
      }

      const data = await response.json();

      setLesson(data.lesson);
      setSource(data.source || "unknown");
      setWarning(data.warning || "");
    } catch (err) {
      setError(
        "Could not connect to the backend. Make sure FastAPI is running at http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">B</span>
          <span>Blu<span className="brand-light">Teacher</span></span>
        </a>
        <span className="offline-badge">
          <span className="status-dot" />
          Local learning studio
        </span>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="eyebrow">YOUR PERSONAL VISUAL TEACHER</div>
          <h1>
            Turn complex topics into
            <span> visual lessons.</span>
          </h1>
          <p>
            Enter a concept, choose your learning preferences, and build a
            lesson designed to make learning easier.
          </p>
        </section>

        <section className="workspace">
          <div className="form-panel">
            <div className="section-heading">
              <span className="step-number">01</span>
              <div>
                <h2>Create a lesson</h2>
                <p>Tell us what you want to understand.</p>
              </div>
            </div>

            <form onSubmit={generateLesson}>
              <label htmlFor="topic">What do you want to learn?</label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How binary search works"
                rows={3}
                maxLength={300}
                required
              />

              <label htmlFor="level">Learning level</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
              </select>

              <div className="field-row">
                <div>
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="duration">Duration</label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                    <option value="90">90 seconds</option>
                  </select>
                </div>
              </div>

              <button className="generate-button" disabled={loading}>
                {loading ? "Creating lesson..." : "Generate lesson →"}
              </button>

              <p className="form-note">
                Designed for local AI and offline video generation.
              </p>
            </form>
          </div>

          <div className="preview-panel">
            <div className="preview-topline">
              <span>LESSON WORKSPACE</span>
              <span className="preview-tag">PREVIEW</span>
            </div>

            {!lesson && !loading && (
              <div className="empty-preview">
                <div className="preview-illustration">
                  <div className="illustration-card card-one">Aa</div>
                  <div className="illustration-card card-two">↗</div>
                  <div className="illustration-center">▶</div>
                </div>
                <h2>Your lesson starts here</h2>
                <p>
                  Your generated lesson scenes will appear here once you
                  submit a topic.
                </p>
                <div className="preview-features">
                  <span>01 · Title scene</span>
                  <span>02 · Visual explanation</span>
                  <span>03 · Example walkthrough</span>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="loader" />
                <h2>Preparing your lesson</h2>
                <p>Connecting to your local lesson generator...</p>
              </div>
            )}

            {error && <div className="message error-message">{error}</div>}

            {warning && (
              <div className="message warning-message">
                {warning}
              </div>
            )}

            {lesson && (
              <div className="lesson-result">
                <div className="result-label">
                  {source === "ollama"
                    ? "GENERATED LESSON"
                    : "SAMPLE / FALLBACK LESSON"}
                </div>
                <h2>{lesson.title}</h2>

                {source === "fallback" && (
                  <p className="fallback-note">
                    This is a generic template, not a verified,
                    topic-specific explanation.
                  </p>
                )}

                {lesson.scenes.map((scene, index) => (
                  <article className="scene-card" key={index}>
                    <div className="scene-number">
                      SCENE {String(index + 1).padStart(2, "0")}
                    </div>
                    <span className="scene-type">
                      {scene.type}
                    </span>
                    <h3>{scene.title}</h3>
                    <p>{scene.caption}</p>

                    {scene.items?.length > 0 && (
                      <ul>
                        {scene.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {scene.code && (
                      <pre>
                        <code>{scene.code}</code>
                      </pre>
                    )}
                  </article>
                ))}

                <div className="export-placeholder">
                  <span>MP4 VIDEO EXPORT</span>
                  <p>
                    Video export, local narration and synchronised
                    captions are the next development steps.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <footer>
          <span>Blu Visual Teacher</span>
          <span>Learn visually. Understand deeply.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
