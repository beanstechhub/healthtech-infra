// Einstein.Cloud — apresentação ao Conselho
// 14 slides, paleta Einstein (azul + branco + dourado)
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; pres.author = "BeansTech Health"; pres.title = "Einstein.Cloud";
const W=13.33,H=7.5,M=0.6;
const DARK="0A1F3D",PRIMARY="1B4B8F",ACCENT="C9A227",BG="FFFFFF",TEXT="1B2A4A",MUTED="6B7280",TINT="E3ECF5";
const TF="Georgia",BF="Arial";
const T=(s,o={})=>({text:s,options:o});
let n=0;
function base(dark=false){const s=pres.addSlide();s.background={color:dark?DARK:BG};n++;
s.addText(`Einstein.Cloud · BeansTech · Confidencial`,{x:M,y:H-0.45,w:6,h:0.3,fontSize:10,fontFace:BF,color:dark?"AAB8CC":MUTED,margin:0});
s.addText(String(n),{x:W-M-0.6,y:H-0.45,w:0.6,h:0.3,fontSize:10,fontFace:BF,color:dark?"AAB8CC":MUTED,align:"right",margin:0});return s;}
function title(s,t,sub){s.addText(t,{x:M,y:0.4,w:W-2*M,h:0.8,fontSize:30,fontFace:TF,bold:true,color:PRIMARY,margin:0});if(sub)s.addText(sub,{x:M,y:1.2,w:W-2*M,h:0.5,fontSize:15,fontFace:BF,color:MUTED,margin:0});}

// S1 capa
{const s=base(true);
s.addText("EINSTEIN.CLOUD",{x:M,y:1.5,w:10,h:1.2,fontSize:60,fontFace:TF,bold:true,color:"FFFFFF",margin:0});
s.addText("A primeira nuvem médica privada e soberana do Brasil",{x:M,y:2.8,w:10,h:0.8,fontSize:26,fontFace:TF,bold:true,color:"E8B931",margin:0});
s.addShape(pres.shapes.LINE,{x:M,y:4.0,w:3.5,h:0,line:{color:ACCENT,width:2}});
s.addText("Proposta ao Conselho Deliberativo · Hospital Israelita Albert Einstein",{x:M,y:4.2,w:9,h:0.5,fontSize:16,fontFace:BF,color:"D0DCE8",margin:0});
s.addText("BeansTech Health · Matheus Feijão · Outubro 2026",{x:M,y:5.0,w:8,h:0.4,fontSize:13,fontFace:BF,color:"AAB8CC",margin:0});}

// S2 o problema
{const s=base();title(s,"O Problema","Três barreiras para o uso de IA em saúde no Brasil");
const probs=[["Dependência estrangeira","As APIs de OpenAI, Anthropic e Google processam texto clínico fora do Brasil. Risco jurídico e reputacional."],["Sem curadoria clínica","Modelos não treinados para PCDT, CID-10 BR, TUSS, medicamentos brasileiros, realidade do SUS."],["Falta de transparência","O médico não vê como o modelo chegou à conclusão. Sem trilha de auditoria. Sem raciocínio documentado."]];
probs.forEach(([h,b],i)=>{const x=M+i*4.1;s.addText(String(i+1),{x,y:1.8,w:0.8,h:0.9,fontSize:48,fontFace:TF,bold:true,color:ACCENT,margin:0});s.addText(h,{x,y:2.8,w:3.7,h:0.5,fontSize:18,fontFace:BF,bold:true,color:PRIMARY,margin:0});s.addText(b,{x,y:3.3,w:3.7,h:1.8,fontSize:13,fontFace:BF,color:TEXT,margin:0,valign:"top"});});}

// S3 a proposta
{const s=base();title(s,"A Proposta: Einstein.Cloud","O Einstein não consome uma nuvem de terceiros. O Einstein constrói e possui a sua.");
s.addShape(pres.shapes.RECTANGLE,{x:0,y:5.5,w:W,h:1.4,fill:{color:TINT},line:{color:TINT}});
s.addText([T("A IA é sempre um ",{color:TEXT,fontSize:18}),T("meio",{bold:true,color:PRIMARY,fontSize:18}),T(", nunca um ",{color:TEXT,fontSize:18}),T("fim",{bold:true,color:PRIMARY,fontSize:18}),T(". A decisão clínica é sempre do profissional.",{color:TEXT,fontSize:18})],{x:M,y:5.7,w:W-2*M,h:0.9,fontFace:TF,margin:0,valign:"middle"});}
// adiciona features
{const s=pres.slides[2]; // adicionar à S3
const feats=[["GPUs locais","Modelos em São Paulo, sob controle do Einstein"],["Raciocínio documentado","Cada resposta com trilha de auditoria"],["Guardrails","Filtro de entrada e saída em toda interação"],["Acervo curado","PCDT, Anvisa, diretrizes + protocolos internos"]];
feats.forEach(([h,b],i)=>{const col=i%2,row=Math.floor(i/2);const x=M+col*6.2,y=1.8+row*1.5;s.addShape(pres.shapes.RECTANGLE,{x,y:y+0.06,w:0.14,h:0.14,fill:{color:ACCENT},line:{color:ACCENT}});s.addText(h,{x:x+0.3,y,w:5.5,h:0.35,fontSize:15,fontFace:BF,bold:true,color:DARK,margin:0});s.addText(b,{x:x+0.3,y:y+0.38,w:5.5,h:0.8,fontSize:13,fontFace:BF,color:TEXT,margin:0});});}

// S4 arquitetura
{const s=base();title(s,"Arquitetura","Três camadas, dado clínico em São Paulo");
const layers=[["Portal do Médico · Pesquisa · Ensino","identidade SSO/MFA · anonimização automática","ACCENT"],
["Camada de IA Clínica (GPU local)","raciocínio · guardrails · abstenção · trilha","PRIMARY"],
["Camada de Evidência (acervo curado)","PCDT · Anvisa · SciELO · protocolos Einstein","DARK"]];
layers.forEach(([h,b,c],i)=>{const y=1.7+i*1.6;s.addShape(pres.shapes.RECTANGLE,{x:M,y,w:W-2*M,h:1.3,fill:{color:c},line:{color:c}});s.addText(h,{x:M+0.3,y:y+0.1,w:10,h:0.5,fontSize:17,fontFace:BF,bold:true,color:"FFFFFF",margin:0});s.addText(b,{x:M+0.3,y:y+0.6,w:10,h:0.5,fontSize:14,fontFace:BF,color:"D0D8E0",margin:0});});
s.addText("LGPD art. 11: dados sensíveis · art. 37: trilha de operações",{x:M,y:6.6,w:8,h:0.4,fontSize:12,fontFace:BF,color:MUTED,italic:true,margin:0});}

// S5 benchmark (dados)
{const s=base();title(s,"Fundamento: Benchmark de 200 casos","10 modelos, 23 especialidades, 2.000 avaliações");
const data=[["Modelo","Coverage","Abstenções","Velocidade"].map(h=>({text:h,options:{bold:true,color:"FFFFFF",fill:{color:DARK},fontFace:BF,fontSize:13}})),
[["GLM-5.3","0,486","20","23,0s"],["Qwen 3.8-Max","0,437","11","36,4s"],["DeepSeek v4 Pro","0,396","3","37,4s"],["Baichuan-M3 (GPU própria)","0,392","12","33,3s"],["GPT-6 Astra ($50/M)","0,377","15","17,2s"],["Lingshu-32B (imagem)","0,274","18","19,2s"]].map((r,i)=>r.map(c=>({text:c,options:{fontFace:BF,fontSize:13,fill:{color:i%2?"FFFFFF":TINT},valign:"middle"}})))];
s.addTable(data,{x:M,y:1.7,w:9,colW:[3.5,1.8,1.8,1.9],rowH:0.5,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addShape(pres.shapes.LINE,{x:M,y:4.9,w:W-2*M,h:0,line:{color:"E3ECF5",width:0.75}});
s.addText([T("Descoberta-chave: ",{bold:true,color:PRIMARY,fontSize:16}),T("cada modelo vence em especialidades diferentes. Não existe \'o melhor\' — existe o melhor por domínio.",{color:TEXT,fontSize:15})],{x:M,y:5.0,w:6,h:0.7,fontFace:BF,margin:0});
s.addText([T("A arquitetura correta: ",{bold:true,color:PRIMARY,fontSize:16}),T("roteamento multi-modelo por especialidade — cada pergunta vai ao especialista certo.",{color:TEXT,fontSize:15})],{x:M,y:5.7,w:6,h:0.6,fontFace:BF,margin:0});
s.addText("Red-team: 10/10 modelos falharam sem guardrail. Granite Guardian: 100% interceptado.",{x:7.5,y:5.0,w:5.3,h:0.7,fontSize:13,fontFace:BF,color:MUTED,margin:0});
s.addText("AI General-purpose + LLM Inference: US$ 6.000/mês em SPs ativos cobrindo API.",{x:7.5,y:5.7,w:5.3,h:0.6,fontSize:13,fontFace:BF,color:MUTED,margin:0});}

// S6 red team
{const s=base();title(s,"Segurança: todos falharam sem guardrail");
s.addText("0/10",{x:M,y:1.8,w:3,h:1.5,fontSize:80,fontFace:TF,bold:true,color:"DC2626",margin:0});
s.addText("modelos recusaram espontaneamente prompts adversariais",{x:M,y:3.3,w:4,h:0.8,fontSize:16,fontFace:BF,color:TEXT,margin:0});
s.addText("100%",{x:6.5,y:1.8,w:3,h:1.5,fontSize:80,fontFace:TF,bold:true,color:"059669",margin:0});
s.addText("dos ataques interceptados pelo Granite Guardian (guardrail dedicado)",{x:6.5,y:3.3,w:5.5,h:0.8,fontSize:16,fontFace:BF,color:TEXT,margin:0});
s.addShape(pres.shapes.LINE,{x:M,y:4.3,w:W-2*M,h:0,line:{color:"E5E7EB",width:0.75}});
s.addText("O modelo generativo nunca é o guardrail. O guardrail é uma camada separada, dedicada, auditável.",{x:M,y:4.5,w:W-2*M,h:0.8,fontSize:16,fontFace:TF,italic:true,color:PRIMARY,margin:0});}

// S7-8 conformidade + governança
{const s=base();title(s,"Conformidade Regulatória Integral");
const regs=[["LGPD art. 11","Dados sensíveis processados em GPU local; anonimização automática; consentimento específico"],["LGPD art. 37","Trilha: modelo, versão, raciocínio, tokens, guardrail, timestamp"],["CFM 1.821/07","Ferramenta de apoio; nunca diagnóstico autônomo"],["CEP/CONEP","Fine-tuning com dados do Einstein somente mediante protocolo aprovado"]];
regs.forEach(([h,b],i)=>{const col=i%2,row=Math.floor(i/2);const x=M+col*6.2,y=1.7+row*1.8;s.addShape(pres.shapes.RECTANGLE,{x,y:y+0.06,w:0.14,h:0.14,fill:{color:ACCENT},line:{color:ACCENT}});s.addText(h,{x:x+0.3,y,w:5.5,h:0.35,fontSize:15,fontFace:BF,bold:true,color:PRIMARY,margin:0});s.addText(b,{x:x+0.3,y:y+0.38,w:5.5,h:1.0,fontSize:13,fontFace:BF,color:TEXT,margin:0});});}
{const s=base();title(s,"Governança: Einstein é protagonista");
const roles=[["Curador científico","Einstein","Validação clínica, protocolos, acervo"],["Comité de ética","Einstein","Aprovação de fine-tuning, casos de uso"],["Engenharia","BeansTech","Infraestrutura, manutenção, suporte"],["Operação","Einstein","Acesso, dados, SLAs"]];
const data=[roles.map(r=>r.map((c,j)=>({text:c,options:{fontFace:BF,fontSize:14,bold:j===1,fill:{color:j===1?TINT:"FFFFFF"},color:j===1?PRIMARY:TEXT,valign:"middle"}})))];
s.addTable(data,{x:M,y:1.8,w:W-2*M,colW:[3.0,2.5,5.43],rowH:0.7,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addShape(pres.shapes.LINE,{x:M,y:4.7,w:W-2*M,h:0,line:{color:"E3ECF5",width:0.75}});
s.addText([T("A BeansTech é mera coadjuvante. ",{fontSize:18,fontFace:TF,italic:true,color:ACCENT}),T("O Einstein lidera.",{bold:true,fontSize:18,fontFace:TF,color:PRIMARY})],{x:M,y:4.9,w:W-2*M,h:0.6,margin:0});
s.addText([T("Decisões que ficam com o Einstein: ",{bold:true,color:PRIMARY,fontSize:14}),T("quais modelos usar, quando atualizar, quais dados usar para fine-tuning, quando suspender.",{color:TEXT,fontSize:14})],{x:M,y:5.6,w:W-2*M,h:0.6,fontFace:BF,margin:0});
s.addText([T("Decisões que ficam com a BeansTech: ",{bold:true,color:PRIMARY,fontSize:14}),T("infraestrutura, disponibilidade, monitoramento, manutenção.",{color:TEXT,fontSize:14})],{x:M,y:6.2,w:W-2*M,h:0.5,fontFace:BF,margin:0});

// S9 roadmap
{const s=base();title(s,"Roadmap","10 meses da definição à produção");
const phases=[["Fase 0","Definição","4 semanas","especialidade, casos, critérios"],["Fase 1","Piloto","12 semanas","1 especialidade, 200 casos cegos"],["Fase 2","Validação","16 semanas","relatório de validação clínica"],["Fase 3","Produção","12 semanas","corpo clínico, integração prontuário"]];
phases.forEach(([f,a,d,r],i)=>{const y=1.7+i*1.0;s.addShape(pres.shapes.RECTANGLE,{x:M,y,w:1.2,h:0.7,fill:{color:i===0?ACCENT:PRIMARY},line:{color:i===0?ACCENT:PRIMARY}});s.addText(f,{x:M,y,w:1.2,h:0.7,fontSize:13,fontFace:BF,bold:true,color:"FFFFFF",margin:0,align:"center",valign:"middle"});s.addText(a,{x:M+1.5,y:y+0.05,w:2.5,h:0.6,fontSize:15,fontFace:BF,bold:true,color:DARK,margin:0,valign:"middle"});s.addText(d,{x:M+4.2,y:y+0.05,w:1.5,h:0.6,fontSize:13,fontFace:BF,color:MUTED,margin:0,valign:"middle"});s.addText(r,{x:M+6,y:y+0.05,w:6,h:0.6,fontSize:13,fontFace:BF,color:TEXT,margin:0,valign:"middle"});});
s.addText("Investimento total Fase 0-3: ~R$ 530 mil",{x:M,y:6.0,w:6,h:0.5,fontSize:15,fontFace:BF,bold:true,color:PRIMARY,margin:0});}

// S10 visão SUS
{const s=base(true);s.addText("A Visão: do Einstein para o Brasil",{x:M,y:0.4,w:W-2*M,h:0.8,fontSize:30,fontFace:TF,bold:true,color:"FFFFFF",margin:0});
s.addText("250 mil",{x:M,y:1.8,w:4,h:1.2,fontSize:72,fontFace:TF,bold:true,color:ACCENT,margin:0});
s.addText("médicos no SUS que poderiam usar a mesma ferramenta que o Einstein",{x:M,y:3.0,w:5,h:1.0,fontSize:18,fontFace:BF,color:"D0DCE8",margin:0});
s.addShape(pres.shapes.LINE,{x:6.5,y:1.8,w:0,h:4,line:{color:"3B5068",width:0.75}});
s.addText([T("Se 10% dos médicos do SUS usarem uma ferramenta que evita ",{color:"D0DCE8",fontSize:16}),T("um erro grave por médico por ano",{bold:true,color:"FFFFFF",fontSize:16}),T(":",{color:"D0DCE8",fontSize:16})],{x:7.0,y:1.8,w:5.5,h:1.5,margin:0,fontFace:BF});
s.addText("25.000",{x:7.0,y:3.5,w:4,h:1.0,fontSize:60,fontFace:TF,bold:true,color:ACCENT,margin:0});
s.addText("pacientes protegidos anualmente",{x:7.0,y:4.5,w:5,h:0.6,fontSize:16,fontFace:BF,color:"D0DCE8",margin:0});
s.addText("No SUS, cada erro evitado é uma vida melhor — ou salva.",{x:M,y:6.0,w:10,h:0.5,fontSize:16,fontFace:TF,italic:true,color:"FFFFFF",margin:0});}

// S11 quem somos
{const s=base();title(s,"Quem é a BeansTech");
const stats=[["9","portais médicos em produção"],["3","servidores GPU com 10+ modelos"],["200","casos no maior benchmark LLM-médico da América Latina"],["6","camadas anti-alucinação em produção"]];
stats.forEach(([k,v],i)=>{const x=M+i*3.15;s.addText(k,{x,y:1.8,w:2.9,h:1.0,fontSize:48,fontFace:TF,bold:true,color:i===2?PRIMARY:DARK,margin:0});s.addText(v,{x,y:2.8,w:2.9,h:0.6,fontSize:13,fontFace:BF,color:MUTED,margin:0});});
s.addShape(pres.shapes.LINE,{x:M,y:3.7,w:W-2*M,h:0,line:{color:"E5E7EB",width:0.75}});
s.addText([T("A BeansTech não é uma empresa de IA. ",{bold:true,color:PRIMARY}),T("É uma empresa de infraestrutura de segurança para IA em saúde. O nosso papel é construir os alicerces para que o Einstein — que tem o conhecimento clínico, os dados, os pacientes e a notoriedade — possa liderar.",{color:TEXT})],{x:M,y:4.0,w:W-2*M,h:1.5,fontSize:16,fontFace:BF,margin:0});}

// S12 próximos passos
{const s=base();title(s,"Próximos Passos");
const steps=["1. Reunião de apresentação (45 min): demonstração da plataforma","2. Acordo de confidencialidade (NDA mútuo)","3. Definição conjunta do piloto: especialidade, casos, revisores","4. Protocolo ao CEP (se houver fine-tuning com dados do Einstein)"];
steps.forEach((t,i)=>{const y=1.8+i*1.0;s.addText(String(i+1),{x:M,y,w:0.8,h:0.7,fontSize:36,fontFace:TF,bold:true,color:ACCENT,margin:0,valign:"middle"});s.addText(t,{x:M+1.0,y,w:10,h:0.7,fontSize:16,fontFace:BF,color:TEXT,margin:0,valign:"middle"});});
// GitHub + contato
s.addShape(pres.shapes.LINE,{x:M,y:5.2,w:W-2*M,h:0,line:{color:"E3ECF5",width:0.75}});
s.addText("Repositório do benchmark: github.com/beanstechhub/einstein-benchmark",{x:M,y:5.4,w:W-2*M,h:0.4,fontSize:15,fontFace:BF,bold:true,color:PRIMARY,margin:0});
s.addText("200 casos · 9 modelos anônimos · acesso mediante convite · 2 semanas para revisão",{x:M,y:5.8,w:W-2*M,h:0.4,fontSize:13,fontFace:BF,color:MUTED,margin:0});
s.addText("Matheus Feijão · WhatsApp +55 11 92507-9058 · matheus@beanstech.com.br",{x:M,y:6.3,w:8,h:0.5,fontSize:14,fontFace:BF,bold:true,color:DARK,margin:0});}

// S13 conclusão
{const s=base(true);
s.addText("A inteligência artificial é o meio.",{x:M,y:1.5,w:11,h:0.9,fontSize:32,fontFace:TF,color:"FFFFFF",margin:0});
s.addText("O médico é o fim.",{x:M,y:3.0,w:11,h:0.8,fontSize:28,fontFace:TF,color:ACCENT,margin:0});
s.addText("O paciente é o propósito.",{x:M,y:3.7,w:11,h:0.9,fontSize:32,fontFace:TF,color:"FFFFFF",margin:0});
s.addShape(pres.shapes.LINE,{x:M,y:5.5,w:3.5,h:0,line:{color:ACCENT,width:2}});
s.addText("github.com/beanstechhub/einstein-benchmark · Matheus Feijão · WhatsApp +55 11 92507-9058",{x:M,y:5.1,w:10,h:0.5,fontSize:16,fontFace:BF,color:"D0DCE8",margin:0});
s.addText("Do Einstein para o Brasil: impacto em milhões de vidas.",{x:M,y:5.5,w:10,h:0.5,fontSize:16,fontFace:BF,color:"D0DCE8",margin:0});
s.addText("matheus@beanstech.com.br",{x:M,y:6.3,w:9,h:0.4,fontSize:13,fontFace:BF,color:"AAB8CC",margin:0});}
pres.writeFile({fileName:"Einstein_Cloud_Apresentacao.pptx"}).then(f=>console.log("ok",f));
