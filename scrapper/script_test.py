import requests
import json

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
  },
  data=json.dumps({
    "model": "qwen/qwen3-30b-a3b:free",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    
  })
)
response_json = response.json() 
print(response_json)