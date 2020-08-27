## Multi-staged build of the video-processing-cli Docker image 

## Building the Video Processing CLI binary
FROM node:12

WORKDIR /app

COPY . .

RUN npm ci && npm run production

## Now building the real docker image with all the dependencies
FROM debian:10-slim

ARG CI_CACHE_DOMAIN

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /video-processing-cli/

COPY --from=0 /app/dist/video-processing-cli-linux ./video-processing-cli

RUN mkdir ./bin \
    && apt-get -yqq update && apt-get install -y xz-utils \
    && chmod +x ./video-processing-cli \
    && ./video-processing-cli install \
    && apt-get remove -y xz-utils \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && chmod +x ./bin/packager-linux \
    && chmod +x ./bin/ffmpeg \
    && chmod +x ./bin/ffprobe

ENTRYPOINT ["./video-processing-cli"] 
