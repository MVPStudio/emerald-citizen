FROM mvpstudio/node:v10

USER mvp
WORKDIR /home/mvp/app

# move package to correct location
COPY ./dist ./

# set correct node path for imports and run it
EXPOSE 8080
ENV NODE_PATH ./src
ENTRYPOINT ["node", "src/server/server.js"]