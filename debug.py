import pandas as pd
import numpy as np

FILE = 'Core Ops_Take Home Case Study.xlsx'
orders = pd.read_excel(FILE, sheet_name='Order_Master')
fulfill = pd.read_excel(FILE, sheet_name='Fulfillment_Lines')

# helper to format nicely
def fmt(x):
    if isinstance(x,(int,np.integer)): return x
    if isinstance(x,(float,np.floating)): return int(x) if float(x).is_integer() else round(float(x),2)
    return x
def fmt_df(df): return df.map(fmt)

# extract order_id, sku from fulfillment_order_id
fulfill[['order_id','sku']] = fulfill['fulfillment_order_id'].str.extract(r'(GC-\d+)-(.+)')

# standardize IDs
for df in (orders, fulfill):
    for c in ['order_id','sku']: df[c] = df[c].astype(str).str.strip().str.upper()

# aggregate fulfillment
fulf_sum = fulfill.groupby(['order_id','sku'], as_index=False)['fulfilled_quantity'].sum()
rec = orders.merge(fulf_sum, on=['order_id','sku'], how='left')
rec['fulfilled_quantity'] = rec['fulfilled_quantity'].fillna(0)
rec['delta'] = rec['order_quantity'] - rec['fulfilled_quantity']
rec['status'] = rec['delta'].apply(lambda x:'matched' if x==0 else ('under' if x>0 else 'over'))
rec['fill_rate'] = rec.apply(lambda r: 1-(r['delta']/r['order_quantity']) if r['order_quantity'] else 0, axis=1)

print("\n=========== RECONCILIATION SAMPLE ===========")
print(fmt_df(rec.head(5)).to_string(index=False))

# metrics
accuracy = (rec['delta']==0).mean()
under_pct = (rec['status']=='under').mean()
fill_rate = rec['fill_rate'].mean()

print("\n=========== METRICS ===========")
print(f"Accuracy: {fmt(accuracy)}")
print(f"Under %: {fmt(under_pct)}")
print(f"Fill Rate: {fmt(fill_rate)}")
