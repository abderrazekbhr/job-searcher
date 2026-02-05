from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import json
from openai import OpenAI

load_dotenv()


class PromptConfig:
    
    def __init__(self,path:str,model_name:str="deepseek/deepseek-r1-0528:free"):
        # self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.client = OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("API_KEY"),
                    )
        self.path=path
        self.model_name=model_name
        
    def testing(self,prompt):
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={
                "type": "json_object"
            }
        )
        return response.choices[0].message.content
    
    
    def __load_prompt(self,prompt_name):
        """Charge un template de prompt depuis un fichier"""
        prompt_file =  f"{self.path}/{prompt_name}.txt"
        with open(prompt_file, 'r', encoding='utf-8') as f:
            return f.read()
    
    
    def __format_prompt(self,prompt,**args):
        """Integrate infomations"""
        adapted_prompt=prompt.format(**args)
        
        return adapted_prompt
    
    def generate(self,prompt_name: str,**args) -> dict:
        """Generate content and return parsed JSON response"""
        prompt_text=self.__load_prompt(prompt_name=prompt_name)
        prompt=self.__format_prompt(prompt=prompt_text,**args)
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # Parse and return JSON
        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            # Fallback: clean the response text
            text = response.text.strip()
            text = text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)

