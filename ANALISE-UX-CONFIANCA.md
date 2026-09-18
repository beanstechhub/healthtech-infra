# ANÁLISE — UX de Confiança e Antecipação de Objeções
# BeansHealth / 8 portais com /decisao

## DIAGNÓSTICO ATUAL

| Portal | IA | "profissional/médico" | LGPD | /decisao | Problema |
|---|---|---|---|---|---|
| dodr.ai | ✓ | ✓ | ✓ | 200 | OK mas sem aviso visível |
| exame.tech | ✓ | ✓ | ✓ | 200 | OK mas sem aviso visível |
| prontuario.tech | — | — | ✓ | 200 | NÃO menciona IA/médico |
| drogaria.tech | ✓ | ✓ | — | 200 | Sem LGPD visível |
| drhealth.tech | ✓ | ✓ | ✓ | 200 | OK |
| portaldodentista.ai | ✓ | ✓ | ✓ | 200 | OK |
| petiq.tech | — | — | — | 200 | SEM aviso de IA/médico/LGPD |
| beanshealth.com.br | ✓ | — | ✓ | 200 | IA sim, mas sem "o médico decide" |

## ARGUMENTOS NÃO CONSTRUTIVOS QUE PRECISAMOS ANTECIPAR

1. "A IA vai substituir médicos" → Esconder o argumento: mostrar que a IA é FERRAMENTA
2. "É perigoso deixar IA decidir" → Mostrar: a IA NÃO decide — estrutura e informa
3. "Meus dados vão para fora" → Mostrar: PII removida em São Paulo, antes de qualquer modelo
4. "Não tem regulação" → Mostrar: LGPD, CFM, CEP — compliance by design
5. "Vai alucinar e matar alguém" → Mostrar: 6 camadas de segurança, abstenção obrigatória
6. "É só mais um chatbot" → Mostrar: benchmark de 200 casos, revisão por médicos
7. "Não confio em IA para saúde" → Mostrar: guardrails, auditoria, trilha completa
8. "Quem é responsável se der errado?" → Mostrar: o médico decide, a ferramenta informa

## SOLUÇÃO — Componente de Confiança

Adicionar em TODOS os /decisao:

1. **Banner de entrada** (não tech, acolhedor):
   "Você é o especialista. A IA organiza. Você decide."

2. **Ícone de status** em cada resposta:
   - ✓ verde: resposta com alta cobertura
   - ⚠ amarelo: verifique em bula/protocolo
   - ○ cinza: IA não conseguiu responder (abstenção)

3. **Rodapé em toda resposta**:
   "Gerado por IA. Verificado por guardrails. Auditável.
    O profissional decide. Sempre."

4. **DPO visível**: dpo@beanstech.com.br
   Em todas as páginas, não escondido em /privacidade

5. **Página "Como a IA trabalha"** (/transparencia):
   - Infográfico: pergunta → PII removida → guardrail → modelo → guardrail → resposta
   - Métricas de segurança em tempo real
   - O que a IA faz / não faz
   - Canal do DPO para dúvidas sobre dados

## IMPLEMENTAÇÃO IMEDIATA

### No client.tsx do /decisao:
- Banner de entrada: acolhedor, não técnico
- Ícone de status: simples (verde/amarelo/cinza)
- Rodapé: DPO email + "o médico decide"
- Página /transparencia: explicação didática

### No beanshealth.com.br:
- Homepage: adicionar "o profissional decide" ao copy principal
- Footer: DPO email em todas as páginas
- Página /transparencia: link no menu
