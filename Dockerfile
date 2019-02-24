FROM mvpstudio/node:v10

WORKDIR /home/mvp/app

# move package to correct location
COPY . ./

# Run build
RUN yarn build

# set correct node path for imports and run it
USER mvp
EXPOSE 8080
ENV NODE_PATH ./src
ENTRYPOINT ["node", "src/server/server.js"]