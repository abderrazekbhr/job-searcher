FROM python:3.10-slim

WORKDIR /app

COPY . /app/

EXPOSE 8000

RUN apt-get update && \
    apt-get upgrade -y && \
    pip install -r requirements.txt

WORKDIR /app/scrapper

CMD ["python", "manage.py", "runserver"]