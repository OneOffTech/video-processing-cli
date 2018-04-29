## Multi-staged build of the video-processing-cli Docker image 

## Building the Video Processing CLI binary
FROM node:8

WORKDIR /app

COPY . .
RUN npm install -q && npm run production


## Now building the real docker image with all the dependencies
FROM debian:jessie

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /video-processing-cli/

COPY --from=0 /app/dist/video-processing-cli-linux ./video-processing-cli

## Install shaka-packager from https://github.com/google/shaka-packager
## to build Dash compatible playlists
# RUN apt-get -yqq update && apt-get install -y curl \
#     && mkdir ./bin \
#     && curl -sL https://github.com/google/shaka-packager/releases/download/${SHAKA_VERSION}/packager-linux -o ./bin/packager \ 
#     && chmod +x ./bin/packager \
#     && apt-get autoremove -y \
#     && apt-get clean -y \
#     && rm -rf /var/lib/apt/lists \
#     && chmod +x ./video-processing-cli

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
