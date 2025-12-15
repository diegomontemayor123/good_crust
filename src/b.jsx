import { Database, Server } from 'lucide-react';

export default function PartB(){
const tables=[
{name:'sales_orders',critical:true,fields:['so_id','customer_id','channel (DTC/Wholesale)','status (with timestamp)','split_shipment_flag']},
{name:'fulfillment_orders',critical:true,fields:['fo_id','linked_so_id','3pl_provider_id','tracking_number','status (with timestamp)']},
{name:'sales_order_lines',critical:true,fields:['sol_id','so_id','sku_id','qty_ordered','unit_price']},
{name:'fulfillment_order_lines',critical:true,fields:['fol_id','fo_id','sku_id','qty_allocated','qty_shipped']},
{name:'production_orders',critical:true,fields:['prod_order_id','co_packer_id','sku_id','qty_planned','qty_received','status (with timestamp)']},
{name:'boms',critical:true,fields:['bom_id','finished_good_sku_id','component_sku_id','qty']},
{name:'inventory_records',critical:true,fields:['record_id','sku_id','location_id','lot_code','expiration_date','qty_on_hand','qty_committed']},
{name:'products',critical:true,fields:['sku_id','name','unit_cost','fulfillment_tag','bom_id']},

];

return(
<div className="space-y-2">
<div>
<h2 className="text-lg font-bold mb-2 flex items-center gap-2"><Server className="w-5 h-5 text-blue-400"/>Logical Systems Architecture</h2>
<div className="bg-slate-950 rounded-lg p-2 border border-slate-800-[420px] overflow-hidden">
<svg viewBox="50 100 900 385" className="w-full">
<defs><marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><polygon points="0 0,10 3,0 6" fill="#94a3b8"/></marker></defs>
<circle cx="500" cy="320" r="72" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="4"/>
<text x="500" y="315" textAnchor="middle" fill="white" fontSize="17" fontWeight="bold">DOSS ERP</text>
<text x="500" y="335" textAnchor="middle" fill="#93c5fd" fontSize="11">Operational Hub</text>

<rect x="410" y="110" width="180" height="72" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2"/>
<text x="500" y="142" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Co-Packer</text>
<text x="500" y="160" textAnchor="middle" fill="#7dd3fc" fontSize="10">Frozen Pizza Production</text>
<rect x="140" y="140" width="180" height="72" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2"/>
<text x="230" y="172" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Shopify</text>
<text x="230" y="190" textAnchor="middle" fill="#6ee7b7" fontSize="10">DTC Orders</text>
<rect x="680" y="140" width="180" height="72" rx="8" fill="#431407" stroke="#f97316" strokeWidth="2"/>
<text x="770" y="172" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Wholesale</text>
<text x="770" y="190" textAnchor="middle" fill="#fdba74" fontSize="10">Target / UNFI / KeHE</text>

<rect x="680" y="405" width="180" height="72" rx="8" fill="#4c1d95" stroke="#a855f7" strokeWidth="2"/>
<text x="770" y="437" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">3PL Network</text>
<text x="770" y="455" textAnchor="middle" fill="#d8b4fe" fontSize="10">JackRabbit & Kratos</text>
<rect x="140" y="405" width="180" height="72" rx="8" fill="#713f12" stroke="#fbbf24" strokeWidth="2"/>
<text x="230" y="437" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">QuickBooks</text>
<text x="230" y="455" textAnchor="middle" fill="#fde047" fontSize="10">General Ledger</text>


{/* Fixed Arrows - Extended to touch circle edge (r=72, cy=320) */}
<line x1="300" y1="214" x2="440" y2="280" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
<text x="275" y="248" fill="#94a3b8" fontSize="10">Orders EDI (24h)</text>

<line x1="700" y1="214" x2="560" y2="280" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
<text x="655" y="248" fill="#94a3b8" fontSize="10">Orders EDI (24h)</text>

<line x1="500" y1="182" x2="500" y2="248" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
<text x="505" y="208" fill="#94a3b8" fontSize="10">Production Receipts (Weekly Email)</text>
{/* Bottom Arrows */}
<line x1="550" y1="372" x2="680" y2="420" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
<text x="540" y="420" fill="#94a3b8" fontSize="10">Fulfillment + Inventory</text>
<line x1="450" y1="372" x2="320" y2="420" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"/>
<text x="360" y="420" fill="#94a3b8" fontSize="10">AR / AP / COGS</text>
</svg>
</div>
</div>

<div className="bg-slate-800/50 p-2 rounded border border-slate-700">
<h4 className="font-bold text-sm text-slate-200 mb-1">ERP Design Rationale</h4>
<p className="text-xs text-slate-400 mb-2"><strong>Sales Orders</strong> capture demand; <strong>SOLs</strong> contain commercial contract at SKU level; <strong>Fulfillment Orders</strong> enable multi-3PL routing without breaking financial integrity; <strong>FOLs</strong> contain 3PL allocations.</p>
<p className="text-xs text-slate-400 mb-2"><strong>Production Orders + BOMs</strong> represent co-packer manufacturing, allowing finished goods receipts to increment inventory and post COGS correctly.</p>
<p className="text-xs text-slate-400 mb-2"><strong>Inventory records</strong> contain lot-tracked inventory with expiration, supporting frozen food compliance and FEFO.</p>
<p className="text-xs text-slate-400"><strong>Not Pictured: GL_events</strong> - QBO receives summarized AR, AP, and COGS / <strong>Customers</strong> - id, name, address, channel, payment detail / <strong>Locations</strong> - id, address, type, contact info.</p>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
<div className="md:col-span-2">
<h3 className="text-lg font-bold flex items-center gap-2"><Database className="w-5 h-5 text-emerald-400"/>Core Data Models</h3>
</div>
{tables.map(t=>(
<div key={t.name} className="bg-slate-800 rounded border border-slate-700 p-1">
<div className="flex justify-between items-center mb-0"><span className="font-mono font-bold text-blue-300">{t.name}</span>{t.critical&&<span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded uppercase">High Priority</span>}</div>
<div className="space-y-1">{t.fields.map(f=><div key={f} className="text-xs font-mono text-slate-400 pl-2 border-l-2 border-slate-600">{f}</div>)}</div>
</div>
))}
</div>
</div>
);
}
