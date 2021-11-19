FROM node:16-bullseye

WORKDIR /app

COPY . . 

RUN pwd && \
    ls -lh && \
    npm install --global @angular/cli@13.0.3 && \
    npm ci && \
    ng build --output-path=dist || cat /root/.npm/_logs/* && \
    ls -lh dist

