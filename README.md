# CliniVision — AI-Powered Chest X-Ray Pneumonia Detection & Clinical Decision Support

CliniVision is an AI-assisted screening system that analyzes chest X-ray images to detect signs of pneumonia. It combines a deep learning model with explainable AI (Grad-CAM) and an AI health assistant to help healthcare professionals get faster, more transparent preliminary assessments — especially in areas with limited access to radiologists.

> ⚠️ **CliniVision is a screening aid, not a diagnostic tool.** Every result must be reviewed by a qualified clinician before any medical decision is made.

**Live Demo:** https://radi-ai-pneumonia-detection-pied.vercel.app/

---

## 🩺 What It Does

- Classifies chest X-rays as **Normal** or **Pneumonia**
- Returns a **confidence score** for every prediction
- Generates a **Grad-CAM heatmap** showing which regions of the X-ray influenced the model's decision
- Provides **AI-assisted health guidance**: risk level, care suggestions, and a medical disclaimer
- Supports **JPG, PNG, and DICOM** image formats

---

## 🧠 How It Works

```
Upload X-Ray → Preprocessing → ResNet18 Model → Prediction + Confidence
                                                        │
                                                        ▼
                                            Grad-CAM Heatmap Generation
                                                        │
                                                        ▼
                                    AI Health Assistant (Risk Level, Care Suggestions)
                                                        │
                                                        ▼
                                        Structured JSON Response → Frontend
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | Python, PyTorch, Torchvision, ResNet18 |
| Explainability | Grad-CAM |
| Backend | FastAPI, Uvicorn |
| Image Processing | Pillow, OpenCV, pydicom |
| Testing | Pytest, FastAPI TestClient |
| Deployment | Docker |

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py               # FastAPI app entry point, routes
│   ├── inference.py          # Model loading and prediction logic
│   ├── schemas.py            # Pydantic request/response models
│   ├── utils.py               # Image preprocessing (incl. DICOM handling)
│   ├── assistant_service.py  # Risk level, care suggestions, disclaimer logic
│   └── models/
│       └── best_model.pth    # Trained ResNet18 weights
├── static/                   # Generated Grad-CAM heatmap images
├── tests/
│   ├── test_api.py           # API endpoint tests
│   └── test_assistant.py     # Assistant service logic tests
├── Dockerfile
├── .dockerignore
├── requirements.txt
└── README.md
```

---

## 🔌 API Endpoints

### `GET /health`
Health check — confirms the API is running.

**Response:**
```json
{ "status": "ok" }
```

### `POST /predict`
Accepts a chest X-ray image and returns a full AI assessment.

**Request:** `multipart/form-data`, field `file` (JPG / PNG / DICOM)

**Response:**
```json
{
  "prediction": "Pneumonia",
  "confidence": 0.94,
  "heatmap_url": "/static/heatmap_xxx.png",
  "risk_level": "High",
  "summary": "Based on the analysis, the model shows 94% confidence for Pneumonia.",
  "care_suggestions": {
    "rest": "Get plenty of rest.",
    "diet": "Eat a balanced diet.",
    "hydration": "Stay hydrated.",
    "warning_signs": "If you experience difficulty breathing, seek immediate care.",
    "follow_up": "Consult a doctor within 24 hours."
  },
  "disclaimer": "This is an AI-assisted preliminary assessment and not a final medical diagnosis. Please consult a qualified doctor."
}
```

---

## 🤖 Model Details

- **Architecture:** ResNet18, pretrained on ImageNet, fine-tuned via transfer learning for binary classification
- **Dataset:** [Chest X-Ray Images (Pneumonia)](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia) — Kaggle (paultimothymooney)
- **Training:** 7 epochs, class-weighted loss to address dataset imbalance
- **Best Validation Accuracy:** 98.12%

### Test Set Performance (624 images)

| Metric | Normal | Pneumonia |
|---|---|---|
| Precision | 98% | 84% |
| Recall | 69% | 99% |
| F1-Score | 81% | 91% |

**Overall Test Accuracy:** 88% &nbsp;&nbsp;|&nbsp;&nbsp; **Weighted F1:** 87%

**Confusion Matrix:** 161 Normal correctly classified, 387 Pneumonia correctly classified, 73 Normal misclassified as Pneumonia, 3 Pneumonia misclassified as Normal.

> **Known limitation:** The model has high sensitivity (99%) for Pneumonia but lower specificity (69%) for Normal cases — meaning it currently over-flags some healthy X-rays. This is an active area of improvement (see Roadmap).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- pip

### Run the Server
```bash
uvicorn app.main:app --reload
```

API will be available at `http://127.0.0.1:8000`
Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs`

### Run Tests
```bash
python -m pytest tests/ -v
```

### Run with Docker
```bash
docker build -t radiai-backend .
docker run -p 8000:8000 --name radiai-app radiai-backend
```

---

## 👥 Who It's For

- **Patients** needing a faster preliminary assessment
- **Doctors and healthcare professionals** seeking AI-assisted decision support
- **Underserved areas** with limited access to radiologists
- **Healthcare systems** looking for more transparent, explainable AI tools

---

## 🗺️ Roadmap / Future Improvements

- [ ] Improve specificity (currently 69%) via threshold tuning and additional Normal-case training data
- [ ] Validate on adult and external/real-world X-ray datasets
- [ ] Extend to multi-class detection (e.g. TB, COVID-19, other respiratory conditions)
- [ ] Clinical validation in partnership with hospitals
- [ ] Mobile-friendly deployment for remote/low-resource areas

---

## ⚖️ Disclaimer

RadiAI is a hackathon project intended for research and educational purposes. It is **not FDA/regulatory approved** and must **not** be used as a substitute for professional medical diagnosis. All predictions require review by a qualified healthcare professional.

---

## 📄 License

This project is open for educational and research use. Please contact the maintainers for other use cases.
