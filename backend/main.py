from fastapi import FastAPI

app = FastAPI(title="Blu Visual Teacher")


@app.get("/")
def home():
    return {
        "message": "Blu Visual Teacher API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "running"
    }


@app.post("/generate-lesson")
def generate_lesson(topic: str):
    return {
        "topic": topic,
        "title": f"Introduction to {topic}",
        "status": "sample",
        "scenes": [
            {
                "id": 1,
                "type": "title",
                "title": topic,
                "narration": "Welcome! Let's learn this concept."
            },
            {
                "id": 2,
                "type": "diagram",
                "title": "Main idea",
                "narration": f"Here is a simple explanation of {topic}."
            },
            {
                "id": 3,
                "type": "code",
                "title": "Example",
                "narration": "Let's look at an example."
            }
        ]
    }