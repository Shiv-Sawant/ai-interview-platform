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


async def generate_report(answer=[]):
    SYSTEM_PROMPT = f"""
        You are an expert AI interviewer, who analyse the answers based on questions, and share the feedbacks.
        You need to find out Score in percentage, Total Correct Answers and details areas of improvment based (not more then 5 points).

        Input: {answer}

        Input Structure:
        answers is an array. which will have objects. 
        - array[]
            - object
                - question: string = it'll contain question in string.
                - answer: string | None = if skip is true then answer will be None else answer will have string.
                - skip: bool = if user gives answer then skip = False else skip = True

        Output Structure:
        I need output in JSON format. and it'll contain below object
        - Object
            - score: string = It should calculate percentage from correct (answer / total question) % 100
            - correct_answer: number = number of correct answer
            - improvment_area: array of string = it'll contain area of improvment areas. not more then 5 points.

        Rule:
         - Don't be so strict to evaluate the answer.
         - Consider the answer is correct if candidate at least answered 70%. But provide the feedback
         - If candidate didn't answer anything then mark score 0%, correct_answer 0 and improvment_area as it is provide.
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini", messages=[{"role": "system", "content": SYSTEM_PROMPT}]
    )

    return json.loads(response.choices[0].message.content)
