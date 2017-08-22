## Multi-staged build of the video-processing-cli Docker image 

## Building the Video Processing CLI binary
FROM node:6

WORKDIR /app

COPY . .
RUN npm install -q && npm run production


## Now building the real docker image with all the dependencies
FROM jrottenberg/ffmpeg:3.3

ENV DEBIAN_FRONTEND noninteractive
ENV SHAKA_VERSION v1.6.2

WORKDIR /video-processing-cli/

COPY --from=0 /app/dist/video-processing-cli-linux ./video-processing-cli

## Install shaka-packager from https://github.com/google/shaka-packager
## to build Dash compatible playlists

RUN apt-get -yqq update && apt-get install -y curl \
    && mkdir ./bin \
    && curl -sL https://github.com/google/shaka-packager/releases/download/${SHAKA_VERSION}/packager-linux -o ./bin/packager \ 
    && chmod +x ./bin/packager \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists \
    && chmod +x ./video-processing-cli

ENTRYPOINT ["./video-processing-cli"] 
