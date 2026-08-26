import os
import sys
import json
import re
import requests
from typing import Dict, List, Any
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_KEY = os.getenv("OPENROUTER_KEY") or os.getenv("OPENROUTER_API_KEY")


class ResonaCrewEngine:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or OPENROUTER_KEY

    def _clean_topic_name(self, raw_input: str) -> str:
        """Strips raw URLs, prompt headers, and formats a clean human topic title"""
        if not raw_input:
            return "AWS & Cloud Engineering"
        
        # Remove prompt boilerplate if present
        clean = re.sub(r'Target Topic / Source Input:|\n|Target Duration:.*', '', raw_input, flags=re.IGNORECASE)
        clean = clean.strip(' "\'\t')

        # If it's a URL, extract readable path segment
        if clean.startswith("http://") or clean.startswith("https://"):
            # Extract last meaningful URL slug
            url_path = clean.split("?")[0].rstrip("/")
            slug = url_path.split("/")[-1]
            if slug and len(slug) > 3:
                # Replace hyphens/underscores with spaces & capitalize
                readable = slug.replace("-", " ").replace("_", " ").title()
                return readable
            return "AWS Developer Tools & Resources"

        return clean if len(clean) < 80 else clean[:80] + "..."

    def _fetch_url_content(self, url: str) -> Dict[str, str]:
        """Scrapes web page HTML and extracts main title and body text"""
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        try:
            res = requests.get(url, headers=headers, timeout=10)
            if res.status_code == 200:
                html = res.text
                
                # Extract Title
                title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
                page_title = title_match.group(1).strip() if title_match else self._clean_topic_name(url)
                page_title = re.sub(r'\s+', ' ', page_title)

                # Strip scripts/styles
                clean_html = re.sub(r'<(script|style|svg|header|footer|nav)[\s\S]*?</\1>', '', html, flags=re.IGNORECASE)
                
                # Extract visible text from paragraphs & headings
                text_blocks = re.findall(r'<(?:p|h1|h2|h3|li)[^>]*>(.*?)</(?:p|h1|h2|h3|li)>', clean_html, re.DOTALL | re.IGNORECASE)
                parsed_text = []
                for b in text_blocks:
                    # Strip inner html tags
                    cleaned_block = re.sub(r'<[^>]+>', '', b).strip()
                    if len(cleaned_block) > 20:
                        parsed_text.append(cleaned_block)
                
                extracted_content = " ".join(parsed_text[:25]) # Max ~2000 words
                if len(extracted_content) > 100:
                    return {
                        "title": page_title,
                        "content": extracted_content[:4000]
                    }
        except Exception as e:
            print(f"[CrewEngine Warning] Web scraping failed for {url}: {e}")

        return {
            "title": self._clean_topic_name(url),
            "content": f"Article covering {self._clean_topic_name(url)}. Focus on technical best practices, cloud SDKs, developer workflows, and system optimization."
        }

    def _call_llm(self, prompt: str, system_prompt: str = "") -> str:
        """Call LLM via OpenRouter API with fallback"""
        if self.api_key:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {"role": "system", "content": system_prompt or "You are an expert podcast scriptwriter."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7
            }
            try:
                res = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=25)
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"[CrewEngine Warning] OpenRouter API call failed: {e}. Using intelligent template generator.")

        return ""

    def _generate_template_script(self, topic_title: str, article_content: str = "") -> str:
        """Fallback script generator using cleaned topic title without raw URLs"""
        clean_title = self._clean_topic_name(topic_title)

        return json.dumps({
            "topic": clean_title,
            "title": f"Deep Dive: {clean_title}",
            "research_summary": f"Multi-agent technical breakdown of {clean_title}. Highlights best practices, architecture choices, and developer workflows.",
            "dialogue": [
                {
                    "speaker": "Alex",
                    "text": f"Welcome back to Resona AI Studio! I'm Alex, and today we're diving into a crucial topic for developers: {clean_title}."
                },
                {
                    "speaker": "Sam",
                    "text": f"Thanks Alex! {clean_title} is a hugely relevant topic right now. There are several key tools and practices developers need to know about."
                },
                {
                    "speaker": "Alex",
                    "text": "That's great! What would you say is the biggest advantage for software engineers adopting these tools?"
                },
                {
                    "speaker": "Sam",
                    "text": "It comes down to productivity and automation. By leveraging modern SDKs and automated workflows, teams eliminate boilerplate and ship features much faster."
                },
                {
                    "speaker": "Alex",
                    "text": "That makes complete sense. How should teams approach integration into existing projects?"
                },
                {
                    "speaker": "Sam",
                    "text": "Start small with core services like AWS Boto3 or SAM CLI, establish modular components, and gradually expand your automation test coverage."
                },
                {
                    "speaker": "Alex",
                    "text": "Fantastic insights as always, Sam! Thank you everyone for tuning in to Resona AI Studio."
                }
            ]
        })

    def run_crew(self, topic_input: str, target_duration: str = "medium") -> Dict[str, Any]:
        """Runs the 3-agent Crew pipeline with web scraping and clean topic names"""
        clean_topic = self._clean_topic_name(topic_input)
        article_data = None

        # Check if topic_input is a URL
        if topic_input.strip().startswith("http://") or topic_input.strip().startswith("https://"):
            print(f"[Resona Crew] Scraping web content from URL: {topic_input}")
            article_data = self._fetch_url_content(topic_input.strip())
            clean_topic = article_data.get("title", clean_topic)
            content_snippet = article_data.get("content", "")
        else:
            content_snippet = topic_input

        system_prompt = """You are Resona AI's Senior Podcast Production Crew.
Your mission is to convert technical topics or scraped article text into an engaging, natural 2-host podcast script.

Hosts:
- Alex (Host A): Inquisitive, upbeat, engaging, asks clarifying questions.
- Sam (Host B): Senior domain expert, analytical, provides clear deep-dive answers.

CRITICAL RULES:
1. NEVER speak raw URL links (e.g. 'https://...'), prompt instructions, or code fences out loud!
2. Refer to the topic by its clean title name.
3. Output format MUST be valid JSON with this exact structure:
{
  "topic": "Clean Topic Title",
  "title": "Catchy Podcast Episode Title",
  "research_summary": "3-sentence research summary of main insights",
  "dialogue": [
    {"speaker": "Alex", "text": "..."},
    {"speaker": "Sam", "text": "..."}
  ]
}"""

        prompt = f"""Topic / Article Title:
"{clean_topic}"

Source Article Content / Context:
"{content_snippet[:3000]}"

Target Duration: {target_duration}

Please generate an engaging, highly informative 2-host dialogue script with 6 to 10 back-and-forth turns discussing the key tools, architecture, and practical takeaways from this source content."""

        raw_output = self._call_llm(prompt, system_prompt)
        
        if raw_output:
            try:
                json_match = re.search(r'```(?:json)?\s*({[\s\S]*?})\s*```', raw_output)
                if json_match:
                    parsed = json.loads(json_match.group(1))
                else:
                    parsed = json.loads(raw_output)
                
                # Sanitize dialogue text to strip any residual URLs or raw prompt headers
                for turn in parsed.get("dialogue", []):
                    text = turn.get("text", "")
                    text = re.sub(r'https?://\S+', '', text) # Strip URLs
                    text = re.sub(r'Target Topic / Source Input:.*', '', text)
                    turn["text"] = text.strip()

                return parsed
            except Exception as e:
                print(f"[CrewEngine Warning] Could not parse LLM output: {e}")

        # Fallback if LLM fails or is offline
        return json.loads(self._generate_template_script(clean_topic, content_snippet))


if __name__ == "__main__":
    crew = ResonaCrewEngine()
    result = crew.run_crew("https://builder.aws.com/content/2zYQkMbmrsxHPtT89s3teyKJh79/aws-tools-and-resources-python?nc1=f_dr")
    print(json.dumps(result, indent=2))
