FROM node:latest

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . /app

RUN pnpm install

EXPOSE 7230

CMD ["pnpm", "run", "dev", "--host"]