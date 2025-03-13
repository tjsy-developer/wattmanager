FROM node:12.22.12

# Dockerfile 작성자
LABEL devops <devops@wattsolution.co.kr>

# 비 루트 사용자 생성
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

# 비 루트 사용자로 설정
USER nonroot

# 애플리케이션 디렉토리 설정
ARG APP_DIR=/home/nonroot/app
WORKDIR $APP_DIR

COPY client/ $APP_DIR/client/
COPY configs/ $APP_DIR/configs/
COPY nuxt_configs/ $APP_DIR/nuxt_configs/
COPY .eslintrc.json/ $APP_DIR/
COPY nuxt_configs.js/ $APP_DIR/
COPY package.json $APP_DIR/
COPY package-lock.json $APP_DIR/

RUN \
	cd ${APP_DIR} && \
	cp ./configs/hdcar ./.env && \
	cp ./nuxt_configs/hdcar ./nuxt.config.js && \
	rm -rf node_modules && \
	npm i && \
	npm run build

CMD ["npm", "start"]