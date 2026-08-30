DUMMY_INTERVIEW_RESPONSE = {
    "introText": (
        "Welcome to your mock interview for the Senior Software Engineer role. "
        "We'll discuss your experience, frontend, backend, databases, and "
        "system design."
    ),
    "questions": [
        "Tell me about yourself and your recent project.",
        "What is the difference between authentication and authorization?",
        "How does React handle state updates internally?",
        "How would you design a REST API for a job portal?",
        "What is the difference between SQL and NoSQL databases?",
        "How would you implement caching for a high-traffic application?",
        "Design a scalable notification system.",
    ],
}

DUMMY_REPORT_RESPONSE = {
    "overallScore": 74,
    "strengths": [
        "Strong frontend fundamentals",
        "Good understanding of REST APIs",
        "Clear communication",
    ],
    "weaknesses": [
        "Database scaling",
        "Distributed systems",
        "Caching strategies",
    ],
    "genericAdvice": [
        "Structure system design answers before discussing technologies.",
        "Explain trade-offs when selecting databases.",
        "Practice capacity estimation.",
    ],
    "roadmap": [
        {
            "topic": "Database Scaling",
            "priority": "HIGH",
            "concepts": [
                "Replication",
                "Partitioning",
                "Sharding",
                "Indexing",
            ],
        },
        {
            "topic": "Distributed Systems",
            "priority": "HIGH",
            "concepts": [
                "Message queues",
                "Kafka",
                "Idempotency",
                "Retries",
            ],
        },
    ],
}
