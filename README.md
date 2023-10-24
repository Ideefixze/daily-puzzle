# Daily Puzzle APP

Simple full-stack project with a basic frontend I've made to learn oauth2 with Discord. 

Solve daily puzzle: create a set of words with given letters. Longer sentences with longer words grant more score. To prevent cheating, only yesterday ranking is available.

Application has basic Discord integration: login via Discord and sends message using webhook.

Live version available [HERE](http://20.117.27.54/)

# Tech

Backend: Python, FastAPI, SQLAlchemy with simple local DB (it is easy to connect to remote DB)

Frontend: TypeScript

# Running

Backend:

1. Create virtual env with python 3.9/3.10, activate it and install requirements
2. Create `config.py` file and fill data with `config_template.py` fields
3. Run: `uvicorn main:app` eventually add `--host 0.0.0.0` param if hosting on production environment

Frontend

1. `npm install`
2. `npm start`

# Screenshot

![1](https://i.imgur.com/xmZPNss.png)
![2](https://i.imgur.com/LoqQFuq.png)
