FROM node:12.22.12

# Dockerfile 작성자
MAINTAINER devops <devops@wattsolution.co.kr> 

COPY ./ /root/app/

RUN \
	cd /root/app && \
	cp ./configs/hdcar ./.env && \
	cp ./nuxt_configs/hdcar ./nuxt.config.js && \
	rm -rf node_modules && \
	npm cache clean --force && \
	npm i && \
	cp -a ./changed_node_modules/node_modules ./ && \
	npm run build

#EXPOSE 80 

# 와트매니저 캠 html 전용
#CMD ["bash", "-c", "cp /root/app/VMS/* /root/app/cam-html/ && cd /root/app && npm start >> /root/logs/out.log 2>>/root/logs/error.log"]

#일반
CMD ["bash", "-c", "cd /root/app && npm start"]
