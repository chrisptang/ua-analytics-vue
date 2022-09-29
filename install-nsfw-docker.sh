#!/bin/bash

docker pull eugencepoi/nsfw_api

docker run -d -it -p 127.0.0.1:5000:5000/tcp --env PORT=5000 eugencepoi/nsfw_api:latest