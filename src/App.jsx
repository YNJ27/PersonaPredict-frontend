import { useMemo, useState } from "react";
import axios from "axios";
import "./App.css";
import extrovertImg from "./assets/extrovert.jpg";
import introvertImg from "./assets/introvert.jpg";

const API_BASE_URL = "http://127.0.0.1:8000";

const initialFormValues = {
  hoursSpentAlone: "",
  stageFear: "Yes",
  socialEventFrequency: "",
  goingOutsideFrequency: "",
  drainedAfterSocializing: "Yes",
  closeFriendsCount: "",
  socialMediaPostFrequency: "",
};

function App() {
  // Track which of the three pages we should render (1=intro, 2=form, 3=result).
  const [currentPage, setCurrentPage] = useState(1);
  // Controlled form values so we can build the payload in the right order.
  const [formValues, setFormValues] = useState(initialFormValues);
  // Store the API response so we can show the prediction later.
  const [predictionResult, setPredictionResult] = useState(null);
  // Basic loading + error states to keep the UX simple.
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper text reused across renders without recalculating each time.
  const helperText = useMemo(
    () =>
      "Prediction: 0 → Extrovert, 1 → Introvert. Keep inputs within the shown ranges.",
    []
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Build the payload in the exact column order expected by the backend transformer.
  const buildPayload = () => ({
    hours_spent_alone: Number(formValues.hoursSpentAlone),
    stage_fear: formValues.stageFear,
    social_event_frequency: Number(formValues.socialEventFrequency),
    going_outside_frequency: Number(formValues.goingOutsideFrequency),
    drained_after_socializing: formValues.drainedAfterSocializing,
    close_friends_count: Number(formValues.closeFriendsCount),
    social_media_post_frequency: Number(formValues.socialMediaPostFrequency),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setPredictionResult(null);

    try {
      const payload = buildPayload();
      const { data } = await axios.post(`${API_BASE_URL}/predict`, payload);
      setPredictionResult(data);
      setCurrentPage(3);
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        "Unable to fetch prediction right now. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewPrediction = () => {
    setCurrentPage(1);
    setPredictionResult(null);
    setFormValues(initialFormValues);
    setErrorMessage("");
  };

  const isIntrovert = predictionResult?.label === "Introvert";
  const predictedArticle =
    predictionResult?.label && predictionResult.label === "Extrovert" ? "an" : "an";
  const resultImageSrc = isIntrovert ? introvertImg : extrovertImg;
  const resultImageAlt = predictionResult?.label
    ? `${predictionResult.label} illustration`
    : "Persona illustration";

  return (
    <div className="app-shell">
      {/* -------------------- PAGE 1: INTRO -------------------- */}
      {currentPage === 1 && (
        <section className="page hero-page">
          <div className="hero-content">
            <div className="hero-text-container">
              <h1 className="hero-title">PersonaPredictor</h1>
              <p className="subtitle">
                Discover your personality type
              </p>
            </div>

            <div className="persona-images">
              <div className="persona-image persona-image--intro">
                <img src={extrovertImg} alt="Extrovert" className="persona-photo" />
                <p className="image-label">Extrovert</p>
              </div>
              <div className="persona-image persona-image--intro">
                <img src={introvertImg} alt="Introvert" className="persona-photo" />
                <p className="image-label">Introvert</p>
              </div>
            </div>

            <div className="cta-wrapper">
              <button
                className="cta cta--large"
                type="button"
                onClick={() => setCurrentPage(2)}
              >
                Start Prediction →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* -------------------- PAGE 2: FORM -------------------- */}
      {currentPage === 2 && (
        <section className="page form-page">
          <div className="form-container">
            <form className="form-content" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2 className="form-title">Tell us about your routine</h2>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">
                    Hours spent alone daily <span className="field-hint">(0–11)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    name="hoursSpentAlone"
                    value={formValues.hoursSpentAlone}
                    onChange={handleInputChange}
                    className="field-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Presence of stage fear</label>
                  <select
                    name="stageFear"
                    value={formValues.stageFear}
                    onChange={handleInputChange}
                    className="field-select"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Social event frequency <span className="field-hint">(0–10)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    name="socialEventFrequency"
                    value={formValues.socialEventFrequency}
                    onChange={handleInputChange}
                    className="field-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Going outside frequency <span className="field-hint">(0–7)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    name="goingOutsideFrequency"
                    value={formValues.goingOutsideFrequency}
                    onChange={handleInputChange}
                    className="field-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Feeling drained after socializing</label>
                  <select
                    name="drainedAfterSocializing"
                    value={formValues.drainedAfterSocializing}
                    onChange={handleInputChange}
                    className="field-select"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Number of close friends <span className="field-hint">(0–15)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    name="closeFriendsCount"
                    value={formValues.closeFriendsCount}
                    onChange={handleInputChange}
                    className="field-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Social media post frequency <span className="field-hint">(0–10)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    name="socialMediaPostFrequency"
                    value={formValues.socialMediaPostFrequency}
                    onChange={handleInputChange}
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="form-submit">
                <button className="cta cta--large" type="submit" disabled={isLoading}>
                  {isLoading ? "Analyzing..." : "Predict my personality"}
                </button>

                {isLoading && (
                  <div className="loading-indicator">
                    <div className="spinner" aria-hidden="true" />
                    <span>Analyzing your personality traits...</span>
                  </div>
                )}
                {errorMessage && <p className="error-text">{errorMessage}</p>}
              </div>
            </form>
          </div>
        </section>
      )}

      {/* -------------------- PAGE 3: RESULT -------------------- */}
      {currentPage === 3 && (
        <section className="page result-page">
          <div className="result-container">
            <div className="result-content">
              <div className="result-image-area">
                {predictionResult ? (
                  <img
                    src={resultImageSrc}
                    alt={resultImageAlt}
                    className="result-photo"
                  />
                ) : (
                  <div className="result-icon" aria-label="Predicted persona">
                    🎯
                  </div>
                )}
              </div>

              <div className="result-info">
                <h2 className="result-title">Prediction Result</h2>
                <p className="result-text">
                  {predictionResult
                    ? `You are predicted to be ${predictedArticle} ${predictionResult.label}.`
                    : "Prediction result will appear here."}
                </p>
                {typeof predictionResult?.confidence === "number" && (
                  <div className="confidence-display">
                    <span className="confidence-label">Confidence score: </span>
                    <span className="confidence-value">
                      {(predictionResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                )}

                <div className="result-actions">
                  <button
                    className="cta cta--secondary"
                    type="button"
                    onClick={startNewPrediction}
                  >
                    ← Start New Prediction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;


