-- Schema de identidade compartilhado dos portais healthtech — PolarDB MySQL 8.0 (sa-east-1), database ht_auth.
-- Regra: aqui ficam credenciais de USUÁRIOS FINAIS (hash Argon2id, nunca texto puro). Segredos de infraestrutura
-- (chaves de API, senhas de banco) ficam no KMS 3.0, não nesta tabela.
-- Aplicar: deploy/polardb-init.sh   (idempotente)

CREATE TABLE IF NOT EXISTS tenants (
  id            BINARY(16)   NOT NULL PRIMARY KEY,
  slug          VARCHAR(64)  NOT NULL UNIQUE,            -- dodr, exame, prontuario, drogaria, beanshealth, dentista, drhealth, petiq
  name          VARCHAR(160) NOT NULL,
  vertical      ENUM('healthtech','legaltech','fintech','proptech','other') NOT NULL DEFAULT 'healthtech',
  created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS users (
  id                BINARY(16)   NOT NULL PRIMARY KEY,
  tenant_id         BINARY(16)   NOT NULL,
  email             VARCHAR(320) NOT NULL,
  email_verified_at TIMESTAMP(3) NULL,
  password_hash     VARCHAR(255) NULL,                   -- PHC string: $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
  password_updated_at TIMESTAMP(3) NULL,
  name              VARCHAR(200) NULL,
  role              ENUM('patient','professional','admin','service') NOT NULL DEFAULT 'professional',
  professional_registry VARCHAR(40) NULL,                -- CRM/CRO/COREN + UF, validado fora daqui
  status            ENUM('active','locked','disabled') NOT NULL DEFAULT 'active',
  failed_logins     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until      TIMESTAMP(3) NULL,
  mfa_totp_secret_enc VARBINARY(512) NULL,               -- cifrado com data key do KMS (envelope), nunca em claro
  created_at        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uk_users_tenant_email (tenant_id, email),
  CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id            BINARY(32)   NOT NULL PRIMARY KEY,       -- sha256(token opaco); o token só existe no cookie
  user_id       BINARY(16)   NOT NULL,
  tenant_id     BINARY(16)   NOT NULL,
  created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at    TIMESTAMP(3) NOT NULL,
  last_seen_at  TIMESTAMP(3) NULL,
  ip            VARBINARY(16) NULL,
  user_agent    VARCHAR(300) NULL,
  revoked_at    TIMESTAMP(3) NULL,
  KEY ix_sessions_user (user_id, expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS api_keys (                     -- chaves de IAs parceiras / integrações (api.dodr.ai)
  id            BINARY(16)   NOT NULL PRIMARY KEY,
  tenant_id     BINARY(16)   NOT NULL,
  label         VARCHAR(120) NOT NULL,
  key_prefix    CHAR(12)     NOT NULL,                    -- visível: "ht_live_ab12"
  key_hash      BINARY(32)   NOT NULL UNIQUE,             -- sha256 do segredo completo
  scopes        JSON         NOT NULL,                    -- ["evidence:search","evidence:answer"]
  monthly_budget_usd DECIMAL(10,2) NULL,
  created_by    BINARY(16)   NULL,
  created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  expires_at    TIMESTAMP(3) NULL,
  revoked_at    TIMESTAMP(3) NULL,
  last_used_at  TIMESTAMP(3) NULL,
  KEY ix_api_keys_tenant (tenant_id),
  CONSTRAINT fk_api_keys_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash    BINARY(32)   NOT NULL PRIMARY KEY,
  user_id       BINARY(16)   NOT NULL,
  expires_at    TIMESTAMP(3) NOT NULL,
  used_at       TIMESTAMP(3) NULL,
  CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS auth_audit (                   -- trilha (LGPD art. 37 / CFM 1.821): quem, quando, de onde, resultado
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  at            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  tenant_id     BINARY(16)   NULL,
  user_id       BINARY(16)   NULL,
  event         ENUM('login_ok','login_fail','logout','password_change','password_reset','mfa_ok','mfa_fail','api_key_used','locked','unlocked') NOT NULL,
  ip            VARBINARY(16) NULL,
  user_agent    VARCHAR(300) NULL,
  detail        JSON NULL,
  KEY ix_audit_user_at (user_id, at),
  KEY ix_audit_tenant_at (tenant_id, at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT IGNORE INTO tenants (id, slug, name) VALUES
  (UNHEX(REPLACE(UUID(),'-','')), 'dodr',            'DoDr — Medicina com evidência'),
  (UNHEX(REPLACE(UUID(),'-','')), 'exame',           'exame.tech'),
  (UNHEX(REPLACE(UUID(),'-','')), 'prontuario',      'prontuario.tech'),
  (UNHEX(REPLACE(UUID(),'-','')), 'drogaria',        'drogaria.tech'),
  (UNHEX(REPLACE(UUID(),'-','')), 'beanshealth',     'BeansHealth'),
  (UNHEX(REPLACE(UUID(),'-','')), 'portaldodentista','Portal do Dentista'),
  (UNHEX(REPLACE(UUID(),'-','')), 'drhealth',        'drhealth.tech'),
  (UNHEX(REPLACE(UUID(),'-','')), 'petiq',           'petiq.tech');
