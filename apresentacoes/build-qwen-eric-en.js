// Qwen 3.8-Max in Medicine — PT — para Eric (Alibaba Brasil)
// 12 slides, paleta Alibaba (laranja + azul escuro + branco)
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; pres.author = "BeansTech"; pres.title = "Qwen 3.8-Max in Medicine";
const W=13.33,H=7.5,M=0.6;
const DARK="1B2A4A",PRIMARY="FF6A00",ACCENT="00A8E8",BG="FFFFFF",TEXT="1B2A4A",MUTED="6B7280",TINT="F0F4FF";
const TF="Georgia",BF="Arial"; const T=(s,o={})=>({text:s,options:o});
let n=0;
function base(dark=false){const s=pres.addSlide();s.background={color:dark?DARK:BG};n++;s.addText(`BeansTech · Qwen 3.8-Max · Confidencial`,{x:M,y:H-0.45,w:6,h:0.3,fontSize:10,fontFace:BF,color:dark?"8CA0C0":MUTED,margin:0});s.addText(String(n),{x:W-M-0.6,y:H-0.45,w:0.6,h:0.3,fontSize:10,fontFace:BF,color:dark?"8CA0C0":MUTED,align:"right",margin:0});return s;}
function title(s,t,sub){s.addText(t,{x:M,y:0.4,w:W-2*M,h:0.8,fontSize:30,fontFace:TF,bold:true,color:PRIMARY,margin:0});if(sub)s.addText(sub,{x:M,y:1.2,w:W-2*M,h:0.5,fontSize:15,fontFace:BF,color:MUTED,margin:0});}

// S1 capa
{const s=base(true);s.addText("Qwen 3.8-Max",{x:M,y:1.5,w:8,h:1.2,fontSize:64,fontFace:TF,bold:true,color:"FFFFFF",margin:0});s.addText("in Medicine",{x:M,y:2.7,w:8,h:1.0,fontSize:48,fontFace:TF,color:"FF6A00",margin:0});s.addText("One of the world's best models for clinical decision support",{x:M,y:4.0,w:8,h:0.8,fontSize:20,fontFace:BF,color:"B0C4DE",margin:0});s.addText("Benchmark: 200 casos · 10 modelos · 23 especialidades · 2.000 avaliações",{x:M,y:5.0,w:8,h:0.5,fontSize:14,fontFace:BF,color:"8CA0C0",margin:0});s.addShape(pres.shapes.LINE,{x:M,y:5.8,w:4,h:0,line:{color:PRIMARY,width:2}});s.addText("BeansTech Health → Alibaba Brazil (Eric) · Outubro 2026",{x:M,y:6.0,w:8,h:0.4,fontSize:12,fontFace:BF,color:"8CA0C0",margin:0});}

// S2 benchmark
{const s=base();title(s,"O Benchmark","The largest LLM test para medicina em língua portuguesa já realizado");
const stats=[["200","real clinical cases"],["10","models tested"],["23","medical specialties"],["2.000","total evaluations"]];
stats.forEach(([k,v],i)=>{const x=M+i*3.15;s.addText(k,{x,y:1.8,w:2.9,h:1.0,fontSize:52,fontFace:TF,bold:true,color:i===3?PRIMARY:DARK,margin:0});s.addText(v,{x,y:2.8,w:2.9,h:0.5,fontSize:14,fontFace:BF,color:MUTED,margin:0});});
s.addShape(pres.shapes.LINE,{x:M,y:3.6,w:W-2*M,h:0,line:{color:"E5E7EB",width:0.75}});
s.addText([T("Same standard for all: ",{bold:true,color:DARK}),T("same prompt, same temperature, same context. Evaluation by critical claim coverage.",{color:TEXT})],{x:M,y:3.8,w:W-2*M,h:0.8,fontSize:15,fontFace:BF,margin:0});
const models=["GPT-6 Astra (OpenAI)","Claude Opus 5 (Anthropic)","GLM-5.3 (Z.ai)","Qwen 3.8-Max (Alibaba)","DeepSeek v4 Pro","Kimi K3 (Moonshot)","Baichuan-M3-235B","AntAngelMed-100B","MedGemma-27B","Lingshu-32B (DAMO)"];
s.addText([T("Models tested: ",{bold:true,color:PRIMARY}),T(models.join(" · "),{color:TEXT})],{x:M,y:4.8,w:W-2*M,h:1.2,fontSize:13,fontFace:BF,margin:0});}

// S3 ranking
{const s=base();title(s,"Overall Ranking","Coverage = fraction das critical claims from the gold standard present in the answer");
const rows=[["1º","GLM-5.3","0,486","23,0s","Z.ai"],["2º","Qwen 3.8-Max","0,437","36,4s","Alibaba"],["3º","DeepSeek v4 Pro","0,396","37,4s","DeepSeek"],["4º","Baichuan-M3-235B","0,392","33,3s","GPU própria"],["5º","GPT-6 Astra","0,377","17,2s","OpenAI"],["6º","Claude Opus 5","0,347","23,7s","Anthropic"]];
const data=[["Rank","Modelo","Coverage","Velocidade","Provider"].map(h=>({text:h,options:{bold:true,color:"FFFFFF",fill:{color:DARK},fontFace:BF,fontSize:13}})),
...rows.map((r,i)=>r.map((c,j)=>({text:c,options:{fontFace:BF,fontSize:13,color:i===1?PRIMARY:DARK,bold:i===1,fill:{color:i===1?"FFF3E0":i%2?"FFFFFF":TINT},valign:"middle"}})))];
s.addTable(data,{x:M,y:1.5,w:W-2*M,colW:[1.2,3.5,2.0,2.0,2.53],rowH:0.62,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addShape(pres.shapes.RECTANGLE,{x:0,y:6.0,w:W,h:0.9,fill:{color:TINT},line:{color:TINT}});
s.addText("Qwen 3.8-Max outperforms GPT-6 Astra (US$ 50/M) e Claude Opus 5 (US$ 25/M) — the most expensive models on the market.",{x:M,y:6.1,w:W-2*M,h:0.7,fontSize:16,fontFace:TF,italic:true,color:PRIMARY,margin:0,valign:"middle"});}

// S4 multi-morbidade
{const s=base();title(s,"Multi-morbidity: Qwen excellence","The hardest and most common scenario em hospitais brasileiros");
s.addText("0,62",{x:M,y:1.5,w:4,h:1.5,fontSize:96,fontFace:TF,bold:true,color:PRIMARY,margin:0});
s.addText("coverage — 2× better than any other model",{x:M,y:3.0,w:4,h:0.8,fontSize:16,fontFace:BF,color:TEXT,margin:0});
const cases2=[["Idosa 82 anos, 8 medicamentos, DRC aguda","0,75","0,33"],["Cirrose Child C com HCC","0,62","0,33"],["DM2 + ICC + DRC + desnutrição","0,62","0,33"]];
const data=[["Case","Qwen 3.8-Max","GPT-6 Astra"].map(h=>({text:h,options:{bold:true,color:"FFFFFF",fill:{color:DARK},fontFace:BF,fontSize:13}})),
...cases2.map((r,i)=>r.map(c=>({text:c,options:{fontFace:BF,fontSize:14,fill:{color:i%2?"FFFFFF":TINT},valign:"middle"}})))];
s.addTable(data,{x:5.5,y:1.5,w:7.2,colW:[4.2,1.5,1.5],rowH:0.6,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addText("Pacientes complexos, politratados, com interações medicamentosas — exatamente onde o Qwen 3.8-Max raciocina melhor.",{x:M,y:5.2,w:W-2*M,h:0.8,fontSize:15,fontFace:BF,color:TEXT,margin:0});}

// S5 pneumologia
{const s=base();title(s,"Pulmonology: best of all","Coverage 0,75 — 3× better than 2nd place");
const bars=[["Qwen 3.8-Max",0.75,PRIMARY],["GLM-5.3",0.25,DARK],["GPT-6 Astra",0.25,DARK],["Claude Opus 5",0.25,DARK]];
bars.forEach(([name,val,color],i)=>{const y=1.8+i*0.9;s.addShape(pres.shapes.RECTANGLE,{x:M,y,w:val*12,h:0.6,fill:{color},line:{color}});s.addText(name,{x:M,y:y-0.05,w:3,h:0.5,fontSize:14,fontFace:BF,color:TEXT,margin:0});s.addText(String(val).replace(".",","),{x:M+val*12+0.1,y:y-0.05,w:1,h:0.5,fontSize:14,fontFace:BF,bold:true,color,margin:0});});
s.addText("Case: DPOC grave, VEF1 28%, exacerbador frequente. O Qwen 3.8-Max was the only one to indicate all management steps: triple therapy (LABA+LAMA+CSI), rehabilitation, vaccination, oxygen therapy and transplant evaluation.",{x:M,y:5.2,w:W-2*M,h:1.0,fontSize:15,fontFace:BF,color:TEXT,margin:0});}

// S6 raciocínio
{const s=base();title(s,"Documented reasoning in 100% dos casos");
s.addText("100%",{x:M,y:1.8,w:3,h:1.5,fontSize:80,fontFace:TF,bold:true,color:PRIMARY,margin:0});
s.addText("of cases with explicit clinical reasoning before the answer",{x:M,y:3.3,w:4,h:0.7,fontSize:16,fontFace:BF,color:TEXT,margin:0});
const comp=[["Qwen 3.8-Max","100%"],["GLM-5.3","100%"],["DeepSeek v4","100%"],["GPT-6 Astra","6%"],["MedGemma-27B","0%"]];
comp.forEach(([m,v],i)=>{const y=1.8+i*0.8;s.addText(m,{x:6,y,w:3.5,h:0.6,fontSize:15,fontFace:BF,color:TEXT,margin:0,valign:"middle"});const w=parseFloat(v)/100*4;s.addShape(pres.shapes.RECTANGLE,{x:9.5,y,w:Math.max(w,0.1),h:0.5,fill:{color:i<3?PRIMARY:"D1D5DB"},line:{color:i<3?PRIMARY:"D1D5DB"}});s.addText(v,{x:9.5+Math.max(w,0.1)+0.1,y,w:1,h:0.5,fontSize:14,fontFace:BF,bold:i<3,color:i<3?PRIMARY:MUTED,margin:0,valign:"middle"});});
s.addText("Why it matters: medical audit,  regulatory compliance LGPD/CFM, publishable clinical research.",{x:M,y:6.0,w:W-2*M,h:0.5,fontSize:14,fontFace:BF,color:MUTED,margin:0});}

// S7 custo
{const s=base();title(s,"Effective cost per 1.000 responses");
const costs=[["Qwen 3.8-Max",2.80,PRIMARY],["Claude Opus 5",16.00,DARK],["GPT-6 Astra",32.00,DARK]];
costs.forEach(([name,cost,color],i)=>{const y=1.8+i*1.2;const w=cost/32*10;s.addShape(pres.shapes.RECTANGLE,{x:M,y,w,h:0.8,fill:{color},line:{color}});s.addText(name,{x:M,y:y-0.35,w:4,h:0.3,fontSize:14,fontFace:BF,color:TEXT,margin:0});s.addText(`US$ ${cost.toFixed(2)}`,{x:M+w+0.2,y,w:2,h:0.8,fontSize:18,fontFace:TF,bold:true,color,margin:0,valign:"middle"});});
s.addText([T("Qwen 3.8-Max is ",{color:TEXT}),T("11× cheaper",{bold:true,color:PRIMARY}),T(" que o GPT-6 Astra e ",{color:TEXT}),T("6× mais barato",{bold:true,color:PRIMARY}),T(" que o Claude Opus 5 — with superior quality.",{color:TEXT})],{x:M,y:5.5,w:W-2*M,h:0.8,fontSize:16,fontFace:BF,margin:0});}

// S8 lingshu
{const s=base();title(s,"Lingshu-32B (base Qwen2.5-VL): imagem médica","The best open model for multimodal medical VQA");
const data=[["Benchmark","Lingshu-32B","GPT-4.1","Claude Sonnet 4"].map(h=>({text:h,options:{bold:true,color:"FFFFFF",fill:{color:DARK},fontFace:BF,fontSize:13}})),
[["Média (7 benchmarks)",66.6,63.4,61.5],["VQA-RAD (radiologia)",76.5,65.0,"—"],["SLAKE (radiologia)",89.2,72.2,"—"],["MIMIC-CXR (laudos)",67.1,57.1,"—"]].map((r,i)=>r.map(c=>({text:String(c).includes(".")?String(c).replace(".",","):String(c),options:{fontFace:BF,fontSize:14,fill:{color:i%2?"FFFFFF":TINT},valign:"middle"}})))];
s.addTable(data,{x:M,y:1.5,w:W-2*M,colW:[4.0,3.0,3.0,2.03],rowH:0.62,border:{type:"solid",pt:0.5,color:"E5E7EB"}});
s.addText("12 modalities: RX · TC · RM · ultrassom · histopatologia · dermatoscopia · fundoscopia · OCT · endoscopia · microscopia · fotografia · PET",{x:M,y:4.8,w:W-2*M,h:0.5,fontSize:14,fontFace:BF,color:PRIMARY,bold:true,margin:0});}

// S9-11 sugestões
{const s=base();title(s,"Recommendations to make Qwen the Nº 1","6 concrete actions");
const sug=[["1. Fine-tuning PT-BR medical","+15-20 pts in coverage com PCDT/bulas/diretrizes BR"],["2. Lingshu radiologia brasileira","World.s best RX model em PT com dados de hospitais parceiros"],["3. Qwen-Med dedicado","Official medical model (como MedGemma, mas aberto)"],["4. Qwen-Flash-Medical","Distilled version <5s for triage in PS/UPA"],["5. Presença em São Paulo","Latency <15s (vs 36s at via Singapura)"],["6. Open validation program","Published study with partner hospitals and medical societies"]];
sug.forEach(([h,b],i)=>{const col=i%2,row=Math.floor(i/2);const x=M+col*6.2,y=1.7+row*1.6;s.addShape(pres.shapes.RECTANGLE,{x,y:y+0.08,w:0.14,h:0.14,fill:{color:PRIMARY},line:{color:PRIMARY}});s.addText(h,{x:x+0.3,y,w:5.6,h:0.35,fontSize:15,fontFace:BF,bold:true,color:DARK,margin:0});s.addText(b,{x:x+0.3,y:y+0.38,w:5.6,h:0.9,fontSize:13,fontFace:BF,color:TEXT,margin:0});});}

// S12 roadmap + contato
{const s=base();title(s,"Roadmap and Contact");
const phases=[["Fase 1","Fine-tune Qwen PT-BR medical","6 meses","+15-20 pts"],["Fase 2","Lingshu Brazilian radiology","6 meses","Melhor RX do mundo"],["Fase 3","Dedicated Qwen Medical","12 meses","Compete with MedGemma"],["Fase 4"," Brazil presence (SP)","3 meses","Latency <15s"],["Fase 5","Validation program","12 meses","Published study"]];
phases.forEach(([f,a,d,r],i)=>{const y=1.6+i*0.8;s.addText(f,{x:M,y,w:1.2,h:0.6,fontSize:14,fontFace:BF,bold:true,color:PRIMARY,margin:0,valign:"middle"});s.addText(a,{x:M+1.3,y,w:4.5,h:0.6,fontSize:14,fontFace:BF,color:TEXT,margin:0,valign:"middle"});s.addText(d,{x:M+6,y,w:1.5,h:0.6,fontSize:14,fontFace:BF,color:MUTED,margin:0,valign:"middle"});s.addText(r,{x:M+7.6,y,w:4.5,h:0.6,fontSize:14,fontFace:BF,bold:true,color:ACCENT,margin:0,valign:"middle"});});
s.addShape(pres.shapes.LINE,{x:M,y:6.0,w:W-2*M,h:0,line:{color:"E5E7EB",width:0.75}});
s.addText("Matheus Feijão · WhatsApp +55 11 92507-9058 · matheus@beanstech.com.br",{x:M,y:6.2,w:8,h:0.5,fontSize:14,fontFace:BF,color:DARK,bold:true,margin:0});}
pres.writeFile({fileName:"Qwen_Medicina_Eric_EN.pptx"}).then(f=>console.log("ok",f));
