from dotenv import load_dotenv
from google import genai

import os

load_dotenv()

client = genai.Client()

# client = OpenAI(
#   base_url="https://openrouter.ai/api/v1",
#   api_key=os.getenv("API_KEY"),
# )


def generate(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text
