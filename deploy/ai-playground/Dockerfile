FROM python:3.12-slim
RUN pip install --no-cache-dir fastapi uvicorn[standard] httpx
WORKDIR /app
COPY app.py .
EXPOSE 8090
CMD ["uvicorn","app:app","--host","0.0.0.0","--port","8090"]
