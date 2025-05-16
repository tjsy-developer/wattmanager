FROM node:16.20.2

# Dockerfile 작성자
LABEL maintainer="devops@wattsolution.co.kr"

# 비 루트 사용자 생성
RUN groupadd -r nonroot && useradd -r -g nonroot nonroot

# 애플리케이션 디렉토리 설정
ARG APP_DIR=/home/nonroot/app

# 작업 디렉토리 설정
WORKDIR $APP_DIR

# 애플리케이션 파일복사
COPY client/ $APP_DIR/client/
COPY configs/ $APP_DIR/configs/
COPY nuxt_configs/ $APP_DIR/nuxt_configs/
COPY .eslintrc.json $APP_DIR/
COPY nuxt.config.js/ $APP_DIR/
COPY package.json $APP_DIR/
COPY package-lock.json $APP_DIR/
COPY .env $APP_DIR/
COPY nuxt.config.js $APP_DIR/

# 환경 변수 파일 복사
# COPY configs/hdcardev $APP_DIR/.env
# COPY nuxt_configs/hdcardev $APP_DIR/nuxt.config.js

# 의존성 설치 & # 애플리케이션 빌드
RUN npm install --legacy-peer-deps
RUN npm run build

# npm 캐시 디렉토리 권한 수정
RUN mkdir -p /home/nonroot/blackduck && chown -R 999:999 /home/nonroot

# 비 루트 사용자로 설정
USER nonroot

CMD ["npm", "start"]