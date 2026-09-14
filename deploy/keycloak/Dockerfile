# Keycloak otimizado para MySQL (PolarDB) — build "optimized" evita rebuild a cada start.
# Versão fixada: nunca usar :latest em produção (regra do REBUILD §6).
FROM quay.io/keycloak/keycloak:26.4 AS builder
ENV KC_DB=mysql
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_FEATURES=passkeys
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.4
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENV KC_DB=mysql
ENV KC_HTTP_ENABLED=true
ENV KC_PROXY_HEADERS=xforwarded
ENV KC_HTTP_PORT=8080
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized", "--import-realm"]
