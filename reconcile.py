import pandas as pd
import numpy as np

FILE = 'Core Ops_Take Home Case Study.xlsx'
order_master = pd.read_excel(FILE, sheet_name='Order_Master')
fulfillment = pd.read_excel(FILE, sheet_name='Fulfillment_Lines')

def fmt(x):
    if isinstance(x,(int,np.integer)): return x
    if isinstance(x,(float,np.floating)): return int(x) if float(x).is_integer() else round(float(x),2)
    return x
def fmt_df(df): return df.map(fmt)

def parse_fid(fid):
    parts = str(fid).split('-')
    order_id = f"GC-{parts[1]}"
    sku = f"{parts[2]}-{parts[3]}"
    return order_id, sku

fulfillment[['order_id','sku']] = fulfillment['fulfillment_order_id'].apply(lambda x: pd.Series(parse_fid(x)))
for df, cols in ((order_master,['order_id','sku']), (fulfillment,['order_id','sku'])):
    for c in cols: df[c] = df[c].astype(str).str.strip().str.upper()
fulf_sum = fulfillment.groupby(['order_id','sku'], as_index=False)['fulfilled_quantity'].sum()
rec = order_master.merge(fulf_sum, on=['order_id','sku'], how='left')
rec['fulfilled_quantity'] = rec['fulfilled_quantity'].fillna(0)
rec['delta'] = rec['order_quantity'] - rec['fulfilled_quantity']
rec['status'] = rec['delta'].apply(lambda x:'matched' if x==0 else ('under' if x>0 else 'over'))
rec['pct_fulfilled'] = rec['fulfilled_quantity'] / rec['order_quantity']

print("\n=========== RECONCILIATION TABLE SAMPLE ===========")
print(fmt_df(rec.head(5)).to_string(index=False))
print("\n=========== DIAGNOSTIC SUMMARY ===========")
print("Orders by status:")
print(rec['status'].value_counts(dropna=False).to_string())
print("\nTotal missing units:")
print(fmt(rec['delta'].sum()))

def extract_3pl(location):
    loc = location.replace('_','-').upper()
    if 'JACKRABBIT' in loc: return 'JACKRABBIT'
    if 'KRATOS' in loc: return 'KRATOS'
fulfillment['3PL'] = fulfillment['fulfillment_location'].apply(extract_3pl)
fulfillment_lines_agg = fulfillment.groupby(['order_id','sku','3PL'], as_index=False)['fulfilled_quantity'].sum()
joined = order_master.merge(fulfillment_lines_agg, on=['order_id','sku'], how='left')
joined['fulfilled_quantity'] = joined['fulfilled_quantity'].fillna(0)
joined['delta_by_line'] = joined['order_quantity'] - joined['fulfilled_quantity']

def compute_3pl_metrics(f_df, ship_threshold_days=5):
    metrics = {}
    groups = f_df.groupby('3PL')
    for name, g in groups:
        merged = g.merge(order_master, on=['order_id','sku'], how='left', suffixes=('','_order'))
        merged['expected_qty'] = merged['order_quantity'].fillna(0)
        merged['fulfilled_qty'] = merged['fulfilled_quantity'].fillna(0)
        merged['order_date'] = pd.to_datetime(merged['order_date'])
        merged['ship_date_dt'] = pd.to_datetime(merged.get('ship_date_dt', pd.NaT))
        merged['days_to_ship'] = (merged['ship_date_dt'] - merged['order_date']).dt.days
        ontime_count = ((merged['days_to_ship']<=ship_threshold_days)&(merged['days_to_ship'].notna())).sum()
        ontime_rate = ontime_count / len(merged) if len(merged)>0 else None
        volume_delta = ((merged['expected_qty'] - merged['fulfilled_qty']).sum() / merged['expected_qty'].sum()) if merged['expected_qty'].sum() else 0
        statuses = fulfillment[fulfillment['3PL']==name]['erp_sync_status'].fillna('UNKNOWN')
        synced_pct = (statuses=='Synced').sum() / len(statuses) if len(statuses)>0 else None
        total_fulfillments = len(g)
        unique_orders = g['order_id'].nunique()
        avg_shipments_per_order = total_fulfillments / unique_orders if unique_orders else 0
        metrics[name] = {'fill_rate':fmt(1-volume_delta),
                        f'on_time_rate_<={ship_threshold_days}_days':fmt(ontime_rate) if ontime_rate is not None else None,
                        'synced_pct':fmt(synced_pct) if synced_pct is not None else None,
                        'avg_shipments_per_order':fmt(avg_shipments_per_order),
                        'total_lines':fmt(len(merged)),}
    return metrics

per_3pl_df = fulfillment.copy()
per_3pl_df = per_3pl_df.merge(order_master[['order_id','sku','order_quantity']], on=['order_id','sku'], how='left')
metrics = compute_3pl_metrics(per_3pl_df, ship_threshold_days=5)

print("\n===== COMPLETELY MISSING ORDERS =======")
print(rec.groupby('order_id')['fulfilled_quantity'].sum().loc[lambda s: s==0].index.tolist())

print("\n=========== CHANNEL SUMMARY ===========")
rec['channel'] = rec['channel'].astype(str).str.upper()
chan = rec.groupby('channel').agg(
    units_ordered=('order_quantity','sum'),
    units_fulfilled=('fulfilled_quantity','sum'),
    pct_fulfilled=('pct_fulfilled','mean'),).reset_index()
chan_tot = pd.DataFrame([{  'channel':'TOTAL',
                            'units_ordered':fmt(chan['units_ordered'].sum()),
                            'units_fulfilled':fmt(chan['units_fulfilled'].sum()),
                            'pct_fulfilled':fmt(chan['pct_fulfilled'].mean()),}])
chan = pd.concat([chan, chan_tot], ignore_index=True)
print(fmt_df(chan).to_string(index=False))


print("\n=========== EAST vs WEST SUMMARY ===========")
rec['region']=fulfillment.groupby(['order_id','sku'])['fulfillment_location']\
    .transform(lambda x: ('WEST' if 'WEST' in str(x.iloc[0]).upper() 
                                else ('EAST' if 'EAST' in str(x.iloc[0]).upper() 
                                else 'PENDING')))
eastwest=rec.groupby('region').agg(
    units_ordered=('order_quantity','sum'),
    units_fulfilled=('fulfilled_quantity','sum'),
    pct_fulfilled=('pct_fulfilled','mean'),).reset_index()
eastwest_tot=pd.DataFrame([{'region':'TOTAL',
                            'units_ordered':fmt(eastwest['units_ordered'].sum()),
                            'units_fulfilled':fmt(eastwest['units_fulfilled'].sum()),
                            'pct_fulfilled':fmt(eastwest['pct_fulfilled'].mean()),}])
eastwest=pd.concat([eastwest,eastwest_tot],ignore_index=True)
print(fmt_df(eastwest).to_string(index=False))


print("\n=========== CARRIER SUMMARY ===========")
rec['carrier']=fulfillment.groupby(['order_id','sku'])['carrier']\
    .transform(lambda x: ('FEDEX' if 'FEDEX' in str(x.iloc[0]).upper()
                          else ('UPS' if 'UPS' in str(x.iloc[0]).upper()else str(x.iloc[0]).upper())))
carrier=rec.groupby('carrier').agg(
    units_ordered=('order_quantity','sum'),
    units_fulfilled=('fulfilled_quantity','sum'),
    pct_fulfilled=('pct_fulfilled','mean'),).reset_index()
carrier_tot=pd.DataFrame([{ 'carrier':'TOTAL',
                            'units_ordered':fmt(carrier['units_ordered'].sum()),
                            'units_fulfilled':fmt(carrier['units_fulfilled'].sum()),
                            'pct_fulfilled':fmt(carrier['pct_fulfilled'].mean()),}])
carrier=pd.concat([carrier,carrier_tot],ignore_index=True)
print(fmt_df(carrier).to_string(index=False))

print("\n=========== SKU SUMMARY ===========")
sku_summary = rec.groupby('sku').agg(
    units_ordered=('order_quantity','sum'),
    units_fulfilled=('fulfilled_quantity','sum'),
    pct_fulfilled=('pct_fulfilled','mean'),
).reset_index().sort_values('pct_fulfilled',ascending=False)
sku_tot = pd.DataFrame([{   'sku':'TOTAL',
                            'units_ordered':fmt(sku_summary['units_ordered'].sum()),
                            'units_fulfilled':fmt(sku_summary['units_fulfilled'].sum()),
                            'pct_fulfilled':fmt(sku_summary['pct_fulfilled'].mean()),}])
sku_summary = pd.concat([sku_summary, sku_tot], ignore_index=True)
print(fmt_df(sku_summary).to_string(index=False))

print("\n=========== SPLIT INTENSITY BY ORDER SIZE (ALL ORDERS) ===========")
order_sizes=order_master.groupby('order_id',as_index=False)['order_quantity'].sum().rename(columns={'order_quantity':'order_size'})
splits=fulfillment.groupby('order_id').size().reset_index(name='num_splits')
df=order_sizes.merge(splits,on='order_id',how='left').fillna({'num_splits':0})
bins=[0,5,20,50,100,np.inf];labels=['1-5','6-20','21-50','51-100','100+']
df['order_size_bucket']=pd.cut(df['order_size'],bins=bins,labels=labels,right=True)

summary=df.groupby('order_size_bucket',observed=True).agg(
    orders=('order_id','nunique'),
    total_splits=('num_splits','sum'),
    units=('order_size','sum')
).assign(splits_per_unit=lambda x:x.total_splits/x.units).reset_index()

tot=pd.DataFrame([{'order_size_bucket':'TOTAL',
                   'orders':summary['orders'].sum(),
                   'total_splits':summary['total_splits'].sum(),
                   'units':summary['units'].sum(),
                   'splits_per_unit':summary['total_splits'].sum()/summary['units'].sum()}])
summary=pd.concat([summary,tot],ignore_index=True)

print("Total orders represented:",summary.loc[summary.order_size_bucket!='TOTAL','orders'].sum())
print(fmt_df(summary).to_string(index=False))


print("\n=========== 3PL DETAIL ==========")
for k,v in metrics.items():
    print(k)
    for mk,mv in v.items(): print(f"  {mk}: {fmt(mv)}")
