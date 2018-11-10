FROM 937163516619.dkr.ecr.us-west-2.amazonaws.com/node:v1

USER mvp
WORKDIR /home/mvp/app

# lint, compile, test, and build all the assets
# RUN yarn build

# move package to correct location
COPY build/dist /home/mvp/app/
RUN cd /home/mvp/app

# set correct node path for imports and run it
EXPOSE 8080
ENV NODE_PATH /home/mvp/app/src
ENTRYPOINT ["node", "src/server/server.js"]