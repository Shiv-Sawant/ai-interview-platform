from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()
client = OpenAI()


async def generate_questions_intro(
    job_title,
    job_description,
    resume_text,
):
    SYSTEM_PROMPT = f"""
    You are an AI interview expert.

    Generate interview questions based on:
    - job title
    - job description
    - candidate resume
    - candidate skills
    - years of experience

    Input:
        job_title: {job_title}
        job_description: {job_description}
        resume_text: {resume_text}

    Rules:

    1. Generate 2-3 interview questions.
    2. Questions should progress from easy to hard.
    3. Questions should only be related to skills found in:
       - resume
       - job description
       - job title
    4. Questions should be short and to the point.
    5. Some questions can be scenario based.

    For each question also return a topic.

    Topic examples:
    - React
    - React Native
    - JavaScript
    - Python
    - FastAPI
    - Backend
    - Database
    - System Design
    - REST API
    - DSA
    - Authentication
    - Cloud

    Keep topic names short and reusable.

    Introduction:
    - Extract candidate name from resume.
    - If name cannot be found use "Candidate".
    - Include candidate name and job title.
    - Keep introduction short and natural.

    Return ONLY valid JSON.

    Required JSON structure:

    {{
        "introText": "Hi Candidate, welcome...",
        "candidate_name": "Candidate",
        "questions": [
            {{
                "question": "Explain React reconciliation.",
                "topic": "React"
            }},
            {{
                "question": "How would you scale this API?",
                "topic": "System Design"
            }}
        ]
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            }
        ],
    )

    return json.loads(response.choices[0].message.content)


async def generate_report(answers: list):
    SYSTEM_PROMPT = """
You are an expert technical interviewer.

Evaluate the candidate's interview answers.

Evaluation rules:
- Do not be excessively strict.
- Give partial credit when an answer demonstrates reasonable understanding.
- If an answer is skipped or empty, treat it as unanswered.
- Evaluate answers based on correctness, clarity, technical depth, and relevance.
- overallScore must be an integer from 0 to 100.
- Provide no more than 5 items in strengths, weaknesses, and genericAdvice.
- Roadmap should focus on the candidate's most important improvement areas.

Return ONLY valid JSON in exactly this structure:

{
  "overallScore": 75,
  "strengths": [
    "Strong React fundamentals",
    "Good understanding of REST APIs"
  ],
  "weaknesses": [
    "Needs improvement in database scaling",
    "Limited knowledge of distributed systems"
  ],
  "genericAdvice": [
    "Structure answers before explaining",
    "Use concrete examples when explaining concepts"
  ],
  "roadmap": [
    {
      "topic": "Database Scaling",
      "priority": "HIGH",
      "items": [
        "Replication",
        "Partitioning",
        "Sharding",
        "Indexing"
      ]
    },
    {
      "topic": "Distributed Systems",
      "priority": "HIGH",
      "items": [
        "Message queues",
        "Kafka",
        "Idempotency",
        "Retries"
      ]
    }
  ]
}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": (
                    "Evaluate these interview answers:\n\n"
                    + json.dumps(
                        answers,
                        ensure_ascii=False,
                    )
                ),
            },
        ],
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)
