FROM denoland/deno:2.1.5

WORKDIR /app

COPY Server/deno.json Server/deno.lock* ./
COPY Server/ ./

RUN deno cache main.js

EXPOSE 8000

CMD ["deno", "task", "start"]