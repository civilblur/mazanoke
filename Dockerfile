FROM node:alpine AS prepare

RUN mkdir -p /usr/share/nginx/html/assets
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./assets /usr/share/nginx/html/assets
COPY ./favicon.ico /usr/share/nginx/html
COPY ./manifest.json /usr/share/nginx/html
COPY ./service-worker.js /usr/share/nginx/html
COPY ./scripts /scripts

RUN node /scripts/environment.common.js

FROM nginx:alpine

# Setup basic authentication
RUN apk add --no-cache apache2-utils
COPY ./scripts/basicauth.sh /usr/local/bin/basicauth.sh
RUN chmod +x /usr/local/bin/basicauth.sh
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Setup optional SEO metatags, toggled at runtime with METATAGS=true
COPY ./scripts/metatags.sh /usr/local/bin/metatags.sh
COPY ./scripts/metatags.html /usr/local/share/mazanoke/metatags.html
RUN chmod +x /usr/local/bin/metatags.sh

COPY --from=prepare /usr/share/nginx/html /usr/share/nginx/html

# Keep a pristine copy so the metatag toggle is reversible across restarts.
RUN cp /usr/share/nginx/html/index.html /usr/local/share/mazanoke/index.html.template

ARG VERSION
ARG REVISION
ARG CREATED

LABEL org.opencontainers.image.title="mazanoke" \
      org.opencontainers.image.description="A self-hosted local image optimizer that runs in your browser" \
      org.opencontainers.image.url="https://github.com/civilblur/mazanoke" \
      org.opencontainers.image.source="https://github.com/civilblur/mazanoke" \
      org.opencontainers.image.vendor="civilblur" \
      org.opencontainers.image.licenses="GPL-3.0-only" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${REVISION}" \
      org.opencontainers.image.created="${CREATED}"

EXPOSE 80

CMD ["/bin/sh", "-c", "/usr/local/bin/metatags.sh; /usr/local/bin/basicauth.sh; nginx -g 'daemon off;'"]
