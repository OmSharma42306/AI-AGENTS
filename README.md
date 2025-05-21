# 🧠 AI Agents Playground

Welcome to the **AI Agents Playground**! This repository is a hands-on project where I learn, build, and experiment with autonomous AI agents. It’s a work-in-progress and a personal sandbox for exploring how agents can think, reason, plan, and interact with the world.

## 🚀 Goals

- Learn the fundamentals of AI agents
- Build modular and scalable agent architectures
- Explore memory, planning, tool use, and environment interaction
- Integrate with LLMs (e.g., OpenAI, HuggingFace, etc.)
- Experiment with frameworks like LangChain, AutoGPT, and others

## 🏗️ Project Structure

```

ai-agents/
│
├── agents/           # Core agent logic and classes
├── tools/            # External tools agents can use (e.g., search, calculator)
├── memory/           # Vector stores, memory logic
├── planners/         # Task and goal management logic
├── environments/     # Simulated or real environments
├── prompts/          # Prompt templates and prompt engineering work
├── notebooks/        # Experiments, analysis, and playgrounds
├── tests/            # Unit tests and integration tests
└── main.py           # Entry point / CLI runner

````

## ⚙️ Tech Stack

- Python 3.10+
- OpenAI / Anthropic APIs
- LangChain / LlamaIndex (optional)
- FAISS / Chroma for memory
- Streamlit or CLI interface
- Others coming as the project evolves...

## 📦 Installation

```bash
git clone https://github.com/OmSharma42306/ai-agents.git
cd ai-agents
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
````



## 📚 Learning Resources

* [BabyAGI](https://github.com/yoheinakajima/babyagi)
* [AutoGPT](https://github.com/Torantulino/Auto-GPT)
* [LangChain](https://docs.langchain.com/)
* [OpenAI Cookbook](https://github.com/openai/openai-cookbook)
* [AI Agent Papers](https://github.com/samber/awesome-ai-agents)

## 🛠️ Todo

* [ ] Implement memory persistence
* [ ] Add long-term planning module
* [ ] Connect to real-world APIs
* [ ] Build web interface (Streamlit or Flask)
