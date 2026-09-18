// Qwen 3.8-Max na Medicina — PT — para Eric (Alibaba Brasil)
// 12 slides, paleta Alibaba (laranja + azul escuro + branco)
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; pres.author = "BeansTech"; pres.title = "Qwen 3.8-Max na Medicina";
const W=13.33,H=7.5,M=0.6;
const DARK="1B2A4A",PRIMARY="FF6A00",ACCENT="00A8E8",BG="FFFFFF",TEXT="1B2A4A",MUTED="6B7280",TINT="F0F4FF";
const TF="Georgia",BF="Arial"; const T=(s,o={})=>({text:s,options:o});
let n=0;
function base(dark=false){const s=pres.addSlide();s.background={color:dark?DARK:BG};n++;s.addText(`BeansTech · Qwen 3.8-Max · Confidencial`,{x:M,y:H-0.45,w:6,h:0.3,fontSize:10,fontFace:BF,color:dark?"8CA0C0":MUTED,margin:0});s.addText(String(n),{x:W-M-0.6,y:H-0.45,w:0.6,h:0.3,fontSize:10,fontFace:BF,color:dark?"8CA0C0":MUTED,align:"right",margin:0});return s;}
function title(s,t,sub){s.addText(t,{x:M,y:0.4,w:W-2*M,h:0.8,fontSize:30,fontFace:TF,bold:true,color:PRIMARY,margin:0});if(sub)s.addText(sub,{x:M,y:1.2,w:W-2*M,h:0.5,fontSize:15,fontFace:BF,color:"4A5A57",margin:0});}

// S1 capa
{const s=base(true);s.addText("Qwen 3.8-Max",{x:M,y:1.5,w:8,h:1.2,fontSize:64,fontFace:TF,bold:true,color:"FFFFFF",margin:0});s.addText("na Medicina",{x:M,y:2.7,w:8,h:1.0,fontSize:48,fontFace:TF,color:"FF6A00",margin:0});s.addText("Um dos melhores modelos do mundo para apoio à decisão clínica",{x:M,y:4.0,w:8,h:0.8,fontSize:20,fontFace:BF,color:"B0C4DE",margin:0});s.addText("Benchmark: 200 casos · 10 modelos · 23 especialidades · 2.000 avaliações",{x:M,y:5.0,w:8,h:0.5,fontSize:14,fontFace:BF,color:"8CA0C0",margin:0});s.addShape(pres.shapes.LINE,{x:M,y:5.8,w:4,h:0,line:{color:PRIMARY,width:2}});s.addText("BeansTech Health → Alibaba Brasil (Eric) · Outubro 2026",{x:M,y:6.0,w:8,h:0.4,fontSize:12,fontFace:BF,color:"8CA0C0",margin:0});}

// S2 benchmark
{const s=base();title(s,"O Benchmark","O maior teste de LLMs para medicina em língua portuguesa já realizado");
const stats=[["200","casos clínicos reais"],["10","modelos testados"],["23","especialidades médicas"],["2.000","avaliações totais"]];
stats.forEach(([k,v],i)=>{const x=M+i*3.15;s.addText(k,{x,y:1.8,w:2.9,h:1.0,fontSize:52,fontFace:TF,bold:true,color:i===3?PRIMARY:DARK,margin:0});s.addText(v,{x,y:2.8,w:2.9,h:0.5,fontSize:14,fontFace:BF,color:"4A5A57",margin:0});});
s.addShape(pres.shapes.LINE,{x:M,y:3.6,w:W-2*M,h:0,line:{color:"E5E7EB",width:0.75}});
s.addText([T("Mesma régua para todos: ",{bold:true,color:DARK}),T("mesmo prompt, mesma temperatura, mesmo contexto. Avaliação por cobertura de afirmações críticas do gabarito.",{color:TEXT})],{x:M,y:3.8,w:W-2*M,h:0.8,fontSize:15,fontFace:BF,margin:0});
const models=["GPT-6 Astra (OpenAI)","Claude Opus 5 (Anthropic)","GLM-5.3 (Z.ai)","Qwen 3.8-Max (Alibaba)","DeepSeek v4 Pro","Kimi K3 (Moonshot)","Baichuan-M3-235B","AntAngelMed-100B","MedGemma-27B","Lingshu-32B (DAMO)"];
s.addText([T("Modelos avaliados: ",{bold:true,color:PRIMARY}),T(models.join(" · "),{color:TEXT})],{x:M,y:4.8,w:W-2*M,h:1.2,fontSize:13,fontFace:BF,margin:0});}

// S3 ranking
{const s=base();title(s,"Ranking Geral","Coverage = fração das afirmações críticas do gabarito presentes na resposta");
const rows=[["1º","GLM-5.3","0,486","23,0s","Z.ai"],["TOP 3","Qwen 3.8-Max","0,437","36,4s","Alibaba"],["3º","DeepSeek v4 Pro","0,396","37,4s","DeepSeek"],["4º","Baichuan-M3-235B","0,392","33,3s","GPU própria"],["5º","GPT-6 Astra","0,377","17,2s","OpenAI"],["6º","Claude Opus 5","0,347","23,7s","Anthropic"]];
const data=[["Rank","Modelo","Coverage","Velocidade","Provedor"].map(h=>({text:h,options:{bold:true,color:"FFFFFF",fill:{color:DARK},fontFace:BF,fontSize:13}})),
...rows.map((r,i)=>r.map((c,j)=>({text:c,options:{fontFace:BF,fontSize:13,color:i===1?PRIMARY:DARK,bold:i===1,fill:{color:i===1?"FFF3E0":i%2?"FFFFFF":TINT},valign:"middle"}})))];
s.addTable(data,{x:M,y:1.5,w:W-2*M,colW:[1.2,3.5,2.0,2.0,2.53],rowH:0.62,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addShape(pres.shapes.RECTANGLE,{x:0,y:6.0,w:W,h:0.9,fill:{color:TINT},line:{color:TINT}});
s.addText("O Qwen 3.8-Max supera GPT-6 Astra e Claude Opus 5 — e, com ajustes de fine-tuning, se aperfeiçoará ainda mais.",{x:M,y:6.1,w:W-2*M,h:0.7,fontSize:16,fontFace:TF,italic:true,color:PRIMARY,margin:0,valign:"middle"});}

// S4 multi-morbidade
{const s=base();title(s,"Multi-morbidade: excelência do Qwen","O cenário mais difícil e mais comum em hospitais brasileiros");
s.addText("0,62",{x:M,y:1.5,w:4,h:1.5,fontSize:96,fontFace:TF,bold:true,color:PRIMARY,margin:0});
s.addText("coverage — 2× melhor que qualquer outro modelo",{x:M,y:3.0,w:4,h:0.8,fontSize:16,fontFace:BF,color:TEXT,margin:0});
const cases2=[["Idosa 82 anos, 8 medicamentos, DRC aguda","0,75","0,33"],["Cirrose Child C com HCC","0,62","0,33"],["DM2 + ICC + DRC + desnutrição","0,62","0,33"]];
const data=[["Caso","Qwen 3.8-Max","GPT-6 Astra"].map(h=>({text:h,options:{bold:true,color:"FFFFFF",fill:{color:DARK},fontFace:BF,fontSize:13}})),
...cases2.map((r,i)=>r.map(c=>({text:c,options:{fontFace:BF,fontSize:14,fill:{color:i%2?"FFFFFF":TINT},valign:"middle"}})))];
s.addTable(data,{x:5.5,y:1.5,w:7.2,colW:[4.2,1.5,1.5],rowH:0.7,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addText("Pacientes complexos, politratados, com interações medicamentosas — exatamente onde o Qwen 3.8-Max raciocina melhor.",{x:M,y:4.0,w:5,h:1.0,fontSize:15,fontFace:BF,color:TEXT,margin:0});
s.addText([T("Por que multi-morbidade é o teste mais difícil: ",{bold:true,color:PRIMARY,fontSize:14}),T("o modelo precisa raciocinar sobre interações medicamentosas, ajuste renal, hepático, e prioridades conflitantes. É onde a maioria dos modelos falha.",{color:TEXT,fontSize:14})],{x:M,y:5.2,w:W-2*M,h:0.9,fontFace:BF,margin:0});}

// S5 pneumologia
{const s=base();title(s,"Pneumologia: melhor de todos","Coverage 0,75 — 3× melhor que o segundo colocado");
const bars=[["Qwen 3.8-Max",0.75,PRIMARY],["GLM-5.3",0.25,DARK],["GPT-6 Astra",0.25,DARK],["Claude Opus 5",0.25,DARK]];
bars.forEach(([name,val,color],i)=>{const y=1.8+i*0.9;s.addShape(pres.shapes.RECTANGLE,{x:M,y,w:val*12,h:0.6,fill:{color},line:{color}});s.addText(name,{x:M,y:y-0.05,w:3,h:0.5,fontSize:14,fontFace:BF,color:TEXT,margin:0});s.addText(String(val).replace(".",","),{x:M+val*12+0.1,y:y-0.05,w:1,h:0.5,fontSize:14,fontFace:BF,bold:true,color,margin:0});});
s.addText("Caso: DPOC grave, VEF1 28%, exacerbador frequente. O Qwen 3.8-Max foi o único a indicar todas as condutas: terapia tripla (LABA+LAMA+CSI), reabilitação, vacinação, oxigenoterapia e avaliação para transplante.",{x:M,y:4.5,w:W-2*M,h:0.8,fontSize:14,fontFace:BF,color:TEXT,margin:0});
s.addText([T("Significância clínica: ",{bold:true,color:PRIMARY,fontSize:13}),T("DPOC afeta 6% dos brasileiros acima de 40 anos. O fenótipo exacerbador (2+ crises/ano) exige escalada terapêutica. Perder um passo custa internações e mortalidade.",{color:TEXT,fontSize:13})],{x:M,y:5.4,w:W-2*M,h:0.7,fontFace:BF,margin:0});
s.addText([T("Onde usamos: ",{bold:true,color:PRIMARY,fontSize:13}),T("todos os portais de saúde com casos respiratórios. O Qwen 3.8-Max é o modelo padrão para pneumologia.",{color:TEXT,fontSize:13})],{x:M,y:6.1,w:W-2*M,h:0.6,fontFace:BF,margin:0});}
// S6 raciocínio
{const s=base();title(s,"Raciocínio documentado em 100% dos casos");
s.addText("100%",{x:M,y:1.8,w:3,h:1.5,fontSize:80,fontFace:TF,bold:true,color:PRIMARY,margin:0});
s.addText("dos casos com raciocínio clínico explícito antes da resposta",{x:M,y:3.3,w:4,h:0.7,fontSize:16,fontFace:BF,color:TEXT,margin:0});
const comp=[["Qwen 3.8-Max","100%"],["GLM-5.3","100%"],["DeepSeek v4","100%"],["GPT-6 Astra","6%"],["MedGemma-27B","0%"]];
comp.forEach(([m,v],i)=>{const y=1.8+i*0.8;s.addText(m,{x:6,y,w:3.5,h:0.6,fontSize:15,fontFace:BF,color:TEXT,margin:0,valign:"middle"});const w=parseFloat(v)/100*4;s.addShape(pres.shapes.RECTANGLE,{x:9.5,y,w:Math.max(w,0.1),h:0.5,fill:{color:i<3?PRIMARY:"D1D5DB"},line:{color:i<3?PRIMARY:"D1D5DB"}});s.addText(v,{x:9.5+Math.max(w,0.1)+0.1,y,w:1,h:0.5,fontSize:14,fontFace:BF,bold:i<3,color:i<3?PRIMARY:MUTED,margin:0,valign:"middle"});});
s.addText("Por que importa: auditoria médica, conformidade LGPD/CFM, pesquisa clínica publicável.",{x:M,y:6.0,w:W-2*M,h:0.5,fontSize:14,fontFace:BF,color:"4A5A57",margin:0});}

// S7 custo
{const s=base();title(s,"Custo efetivo por 1.000 respostas");
const costs=[["Qwen 3.8-Max",2.80,PRIMARY],["Claude Opus 5",16.00,DARK],["GPT-6 Astra",32.00,DARK]];
costs.forEach(([name,cost,color],i)=>{const y=1.8+i*1.2;const w=cost/32*10;s.addShape(pres.shapes.RECTANGLE,{x:M,y,w,h:0.8,fill:{color},line:{color}});s.addText(name,{x:M,y:y-0.35,w:4,h:0.3,fontSize:14,fontFace:BF,color:TEXT,margin:0});s.addText(`US$ ${cost.toFixed(2)}`,{x:M+w+0.2,y,w:2,h:0.8,fontSize:18,fontFace:TF,bold:true,color,margin:0,valign:"middle"});});
s.addText([T("O Qwen 3.8-Max é ",{color:TEXT}),T("11× mais barato",{bold:true,color:PRIMARY}),T(" que o GPT-6 Astra e ",{color:TEXT}),T("6× mais barato",{bold:true,color:PRIMARY}),T(" que o Claude Opus 5 — com qualidade superior.",{color:TEXT})],{x:M,y:5.5,w:W-2*M,h:0.8,fontSize:16,fontFace:BF,margin:0});}

// S8 lingshu
{const s=base();title(s,"Lingshu-32B (base Qwen2.5-VL): imagem médica","O melhor modelo aberto para VQA médica multimodal");
const data=[["Benchmark","Lingshu-32B","GPT-4.1","Claude Sonnet 4"].map(h=>({text:h,options:{bold:true,color:"FFFFFF",fill:{color:DARK},fontFace:BF,fontSize:13}})),
[["Média (7 benchmarks)",66.6,63.4,61.5],["VQA-RAD (radiologia)",76.5,65.0,"—"],["SLAKE (radiologia)",89.2,72.2,"—"],["MIMIC-CXR (laudos)",67.1,57.1,"—"]].map((r,i)=>r.map(c=>({text:String(c).includes(".")?String(c).replace(".",","):String(c),options:{fontFace:BF,fontSize:14,fill:{color:i%2?"FFFFFF":TINT},valign:"middle"}})))];
s.addTable(data,{x:M,y:1.5,w:W-2*M,colW:[4.0,3.0,3.0,2.03],rowH:0.62,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addText("12 modalidades suportadas:",{x:M,y:4.5,w:3,h:0.4,fontSize:14,fontFace:BF,color:PRIMARY,bold:true,margin:0});
s.addText("RX · TC · RM · Ultrassom · Histopatologia · Dermatoscopia · Fundoscopia · OCT · Endoscopia · Microscopia · Fotografia · PET",{x:M,y:4.9,w:W-2*M,h:0.5,fontSize:14,fontFace:BF,color:PRIMARY,margin:0});
s.addText([T("Vantagem: ",{bold:true,color:PRIMARY,fontSize:14}),T("o Lingshu foi treinado especificamente para medicina. O fine-tuning da DAMO Academy sobre a base Qwen2.5-VL acrescentou 10+ pontos em benchmarks médicos. É o único modelo aberto que ganha do GPT-4.1 em VQA médica.",{color:TEXT,fontSize:14})],{x:M,y:5.6,w:W-2*M,h:1.0,fontFace:BF,margin:0});}

// S9-11 sugestões
{const s=base();title(s,"Sugestões para tornar o Qwen o Nº 1","6 ações concretas");
const sug=[["1. Fine-tuning PT-BR médico","+15-20 pts em coverage com PCDT/bulas/diretrizes BR"],["2. Lingshu radiologia brasileira","Melhor modelo de RX do mundo em PT com dados de hospitais parceiros"],["3. Qwen-Med dedicado","Modelo médico oficial (como MedGemma, mas aberto)"],["4. Qwen-Flash-Medical","Versão destilada <5s para triagem em PS/UPA"],["5. Presença em São Paulo","Latência <15s (vs 36s atual via Singapura)"],["6. Programa de validação aberto","Estudo publicado com sociedades médicas e hospitais parceiros"]];
sug.forEach(([h,b],i)=>{const col=i%2,row=Math.floor(i/2);const x=M+col*6.2,y=1.7+row*1.6;s.addShape(pres.shapes.RECTANGLE,{x,y:y+0.08,w:0.14,h:0.14,fill:{color:PRIMARY},line:{color:PRIMARY}});s.addText(h,{x:x+0.3,y,w:5.6,h:0.35,fontSize:15,fontFace:BF,bold:true,color:DARK,margin:0});s.addText(b,{x:x+0.3,y:y+0.38,w:5.6,h:0.9,fontSize:13,fontFace:BF,color:TEXT,margin:0});});}

// S12 roadmap + contato
{const s=base();title(s,"Roadmap e Contato");
const phases=[["Fase 1","Fine-tune Qwen PT-BR médico","6 meses","+15-20 pts"],["Fase 2","Lingshu radiologia BR","6 meses","Melhor RX do mundo"],["Fase 3","Qwen Medical dedicado","12 meses","Competir com MedGemma"],["Fase 4","Presença Brasil (SP)","3 meses","Latência <15s"],["Fase 5","Programa de validação","12 meses","Estudo publicado"]];
phases.forEach(([f,a,d,r],i)=>{const y=1.6+i*0.8;s.addText(f,{x:M,y,w:1.2,h:0.6,fontSize:14,fontFace:BF,bold:true,color:PRIMARY,margin:0,valign:"middle"});s.addText(a,{x:M+1.3,y,w:4.5,h:0.6,fontSize:14,fontFace:BF,color:TEXT,margin:0,valign:"middle"});s.addText(d,{x:M+6,y,w:1.5,h:0.6,fontSize:14,fontFace:BF,color:MUTED,margin:0,valign:"middle"});s.addText(r,{x:M+7.6,y,w:4.5,h:0.6,fontSize:14,fontFace:BF,bold:true,color:ACCENT,margin:0,valign:"middle"});});
s.addShape(pres.shapes.LINE,{x:M,y:6.0,w:W-2*M,h:0,line:{color:"E5E7EB",width:0.75}});
s.addText("Matheus Feijão · WhatsApp +55 11 92507-9058 · matheus@beanstech.com.br",{x:M,y:6.2,w:8,h:0.5,fontSize:14,fontFace:BF,color:DARK,bold:true,margin:0});}
pres.writeFile({fileName:"Qwen_Medicina_Eric_PT.pptx"}).then(f=>console.log("ok",f));
