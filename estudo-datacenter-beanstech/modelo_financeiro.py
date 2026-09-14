"""Cenários ilustrativos em BRL nominais; sem preços cotados ou incentivo aprovado.
Execute: python3 modelo_financeiro.py. Saídas no diretório deste arquivo.
V1 no t0; expansão paga no fim do ano 3 e opera no ano 4.
Não é modelo bancário mensal nem apuração fiscal. Ver ESTUDO-INVESTIMENTO.md.
"""
import csv
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent
CAPEX = [
 ('Terreno/direito de uso e preparação',5,1),
 ('Obras civis',15,12),('Elétrica, UPS, geradores e conexão',22,15),
 ('Refrigeração',12,10),('Rede, CPU e armazenamento',12,14),
 ('Servidores GPU',60,85),('Segurança e plataforma',6,4),
 ('Engenharia, licenças e comissionamento',4,2),
 ('Capital de giro inicial',6,3),('Contingência',8,4)]
SCENARIOS = {
 'adverso':dict(price=18,occ=[.20,.30,.40,.40,.45,.50,.50,.50,.50,.50],services1=9,services2=18,kwh=.85,pue=1.50,decline=.08),
 'referencia':dict(price=30,occ=[.25,.45,.65,.60,.70,.75,.75,.75,.75,.75],services1=18,services2=36,kwh=.65,pue=1.35,decline=.05),
 'favoravel':dict(price=40,occ=[.40,.60,.75,.70,.80,.85,.85,.85,.85,.85],services1=24,services2=48,kwh=.50,pue=1.25,decline=.03)}
def write_csv(name, rows):
 with (ROOT/name).open('w',newline='',encoding='utf-8-sig') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def npv(cfs,r):return sum(v/(1+r)**i for i,v in enumerate(cfs))
def mirr(cfs,r=.15):
 n=len(cfs)-1;pv=-sum(min(v,0)/(1+r)**i for i,v in enumerate(cfs));fv=sum(max(v,0)*(1+r)**(n-i) for i,v in enumerate(cfs))
 return (fv/pv)**(1/n)-1 if fv and pv else None

def model(s,expand=True):
 rows=[];cash=[-150.];nwc=6.
 # Ativos GPU depreciados linearmente 4 anos; reposição ao fim do quarto ano.
 gpu_vintages=[(1,60.)];fixed_vintages=[(1,79.)] # proxy depreciável, não laudo fiscal
 for year in range(1,11):
  v2=expand and year>=4;gpus=640 if v2 else 256;occ=s['occ'][year-1]
  if expand and year==4:gpu_vintages.append((4,85.));fixed_vintages.append((4,61.));nwc+=3
  # inflação de custos 4%; preço GPU com erosão nominal; serviço escala com ocupação
  infl=1.04**(year-1);price=s['price']*(1-s['decline'])**(year-1)
  gpu_rev=gpus*8760*occ*price/1e6
  services=(s['services2'] if v2 else s['services1'])*min(occ/.65,1.2)*1.03**(year-1)
  revenue=gpu_rev+services
  it_mw=(1.6 if v2 else .8)*(.35+.65*occ)
  energy=it_mw*s['pue']*8760*1000*s['kwh']*infl/1e6
  fixed=(20 if v2 else 12)*infl;maintenance=(7 if v2 else 4)*infl;variable=.08*revenue
  ebitda=revenue-energy-fixed-maintenance-variable
  depreciation=sum(v/4 for start,v in gpu_vintages if start<=year<start+4)+sum(v/15 for start,v in fixed_vintages if start<=year<start+15)
  # Proxy IRPJ/CSLL sem benefícios, sem dívida nem compensação de prejuízos: conservador.
  tax=max(0,ebitda-depreciation)*.34
  new_nwc=max(nwc,.10*revenue);delta_nwc=new_nwc-nwc;nwc=new_nwc
  refresh=0.
  if year in (4,8):refresh+=60.;gpu_vintages.append((year+1,60.))
  if expand and year==7:refresh+=85.;gpu_vintages.append((year+1,85.))
  expansion=150. if expand and year==3 else 0.
  fcf=ebitda-tax-delta_nwc-refresh-expansion
  cash.append(fcf)
  rows.append(dict(ano=year,gpus=gpus,ocupacao=occ,preco_gpu_h_brl=round(price,4),receita_gpu_m=round(gpu_rev,4),receita_servicos_m=round(services,4),receita_total_m=round(revenue,4),energia_m=round(energy,4),fixos_m=round(fixed,4),manutencao_m=round(maintenance,4),variaveis_m=round(variable,4),ebitda_m=round(ebitda,4),depreciacao_proxy_m=round(depreciation,4),irpj_csll_proxy_m=round(tax,4),delta_giro_m=round(delta_nwc,4),refresh_m=refresh,expansao_m=expansion,fcf_m=round(fcf,4)))
 return rows,cash

def main():
 assert sum(x[1] for x in CAPEX)==150 and sum(x[2] for x in CAPEX)==150
 write_csv('capex.csv',[dict(item=n,v1_m=a,v2_incremental_m=b,v2_acumulado_m=a+b) for n,a,b in CAPEX])
 summaries=[]
 for name,s in SCENARIOS.items():
  for expand in (False,True):
   key=name+('_v2' if expand else '_v1');rows,cash=model(s,expand);write_csv('fluxo_'+key+'.csv',rows)
   cum=0.;payback=None
   for i,v in enumerate(cash):
    cum+=v/1.15**i
    if cum>=0 and payback is None:payback=i
   summaries.append(dict(cenario=key,vpl_12_m=round(npv(cash,.12),3),vpl_15_m=round(npv(cash,.15),3),vpl_18_m=round(npv(cash,.18),3),tir_modificada_pct=round(mirr(cash)*100,3) if mirr(cash) is not None else '',primeiro_payback_descontado_15=payback if payback is not None else 'nao_atingido',fcf_acumulado_m=round(sum(cash),3)))
 write_csv('resumo_cenarios.csv',summaries)
 # Preço de partida que zera VPL, mantendo as demais premissas de referência.
 thresholds=[]
 for expand in (False,True):
  lo,hi=0.,200.
  for _ in range(80):
   mid=(lo+hi)/2;s=dict(SCENARIOS['referencia'],price=mid)
   if npv(model(s,expand)[1],.15)>0:hi=mid
   else:lo=mid
  thresholds.append(dict(escala='v2' if expand else 'v1',preco_inicial_gpu_h_brl=round((lo+hi)/2,4)))
 write_csv('preco_equilibrio.csv',thresholds)
 # Teste de dívida independente, sem atribuir essas taxas ao BNB.
 debts=[]
 for amount in (75,90,105,150,180,210):
  for rate in (.08,.12,.16):
   for grace in (0,2):
    balance=amount*((1+rate)**grace);amort=balance/8
    debts.append(dict(principal_m=amount,taxa_hipotetica=rate,anos_carencia_capitalizada=grace,amortizacao_anos=8,saldo_inicio_amort_m=round(balance,4),primeiro_servico_sac_m=round(amort+balance*rate,4),cfads_min_dscr_1_3_m=round((amort+balance*rate)*1.3,4)))
 write_csv('sensibilidade_divida.csv',debts)
 (ROOT/'premissas.json').write_text(json.dumps(dict(currency='BRL',units='millions except price',source='analytical assumptions, not quotations',discount_rate=.15,tax_proxy=.34,opex_inflation=.04,terminal_value=0,scenarios=SCENARIOS),ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(summaries,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
