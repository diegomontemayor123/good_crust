import { Zap, AlertCircle, FileText, Package, DollarSign } from 'lucide-react';
import FlowChart from './FlowChart';

function ProcessBox({ step, title, flows }) {
  return (
    <div className="bg-slate-700 rounded p-2 border-2 border-slate-600 h-full flex flex-col">
      <div className="text-xs text-slate-400 mb-1">Step {step}</div>
      <div className="font-bold mb-2 text-sm">{title}</div>
      <div className="flex flex-col space-y-2 flex-grow">
        <FlowSection icon={<Package className="w-3 h-3 text-emerald-300" />} title="Goods" items={flows.goods} color="text-emerald-300"/>
        <FlowSection icon={<Zap className="w-3 h-3 text-blue-300" />} title="Data" items={flows.data} color="text-blue-300"/>
        <FlowSection icon={<DollarSign className="w-3 h-3 text-amber-300" />} title="Money" items={flows.money} color="text-amber-300"/>
      </div>
    </div>
  );
}

function FlowSection({ icon, title, items, color }) {
  if (!items?.length) return null;
  return (
    <div className="border-t border-slate-600/50 pt-2">
      <div className={`flex items-center gap-1 font-semibold text-[10px] uppercase ${color} mb-1`}>{icon} {title}</div>
      <ul className="text-[10px] space-y-0.5 text-slate-300">{items.map((item,i)=><li key={i} className="flex items-start"><span className="text-slate-500 mr-1">•</span>{item}</li>)}</ul>
    </div>
  );
}

export default function PartA() {
  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap className="w-6 h-6 text-yellow-400"/>End-to-End Operational Process</h2>
        <FlowChart />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <ProcessBox step="1" title="Procurement" flows={{goods:['DOSS forecasts raw material needs.'], data:['DOSS generates Purchase Order.','PO sent to Co-Packer (PDF / CSV).'], money:['PO is a spending commitment (Future AP).']}}/>
        <ProcessBox step="2" title="Production" flows={{goods:['Co-packer produces and ships goods to 3PLs.'], data:['Co-packer sends Production Report (Excel).','DOSS receives orders from Shopify & Wholesale via EDI.','DOSS allocates inventory and handles exceptions.',], money:['Co-packer Invoice received (Accounts Payable).',' DTC Pmt Authorized & Wholesale Pmt terms established.']}}/>
        <ProcessBox step="3" title="Fulfillment" flows={{goods:['3PL picks, packs, and ships the product to customers.'], data:['DOSS sends Fulfillment Order to 3PL (EDI).','3PL sends Tracking back to DOSS (SLA: ≤24hr).','DOSS updates Inventory (-Qty).'], money:['Shipping costs recorded on a monthly basis.']}}/>
        <ProcessBox step="4" title="Accounting" flows={{goods:['Satisfied customers have physical goods.'], data:['DOSS sends summarized Ops (API).','DOSS syncs Journal Entries with QBO (API).'], money:['DTC: Payment reconciled in QBO.','Wholesale: AR created in QBO. Payment received later.','DOSS changes inventory asset to COGS.']}}/>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">




          <h3 className="font-bold mb-4 flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            Integration Risks & Dependencies
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <div>
                <strong>Inventory Latency (Blind Spots):</strong>
                <p className="text-slate-500 text-xs">If 3PLs sync via EDI (24hr) and Co-packer via email (Weekly), we risk selling inventory we don't physically have yet.</p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <div>
                <strong>Split Shipment Logic:</strong>
                <p className="text-slate-500 text-xs">If an order contains SKUs located in JackRabbit AND Kratos, DOSS must split the order into two fulfillment requests. If this fails, the customer receives a partial order.</p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-red-400 font-bold">•</span>
              <div>
                <strong>Wholesale Chargebacks:</strong>
                <p className="text-slate-500 text-xs">Target & UNFI have strict EDI windows. A DOSS API outage could miss one of these windows, which could result in chargebacks or other penalties.</p>
              </div>
            </li>
          </ul>
        </div>



        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
            <FileText className="w-5 h-5" />
            The Co-Packer Solution: Crawl, Walk, Run
          </h3>
          <div className="space-y-2">
            <div className="bg-slate-900 p-3 rounded border-l-4 border-emerald-500">
              <div className="text-xs font-bold text-emerald-500 uppercase mb-1">Crawl (Launch)</div>
              <h4 className="font-bold text-sm">Managed CSV Template</h4>
              <p className="text-xs text-slate-400 mt-1">GoodCrust provides a locked Excel template. Co-packer emails it weekly. Ops team uploads to DOSS. <br/><span className="italic text-slate-500">Risk: Up to 7 day data lag.</span></p>
            </div>
            <div className="bg-slate-900 p-3 rounded border-l-4 border-blue-500">
              <div className="text-xs font-bold text-blue-500 uppercase mb-1">Walk (Month 3)</div>
              <h4 className="font-bold text-sm">Lightweight Vendor Portal</h4>
              <p className="text-xs text-slate-400 mt-1">Co-packer logs into a restricted DOSS view to input "Production Complete" quantities only (in near real-time).</p>
            </div>
            <div className="bg-slate-900 p-3 rounded border-l-4 border-purple-500">
              <div className="text-xs font-bold text-purple-500 uppercase mb-1">Run (Year 1)</div>
              <h4 className="font-bold text-sm">OCR Automation / EDI</h4>
              <p className="text-xs text-slate-400 mt-1">Use a tool (e.g., DocParser) to scrape their PDF emails and auto-inject into DOSS, including qty, timestamps, and lot IDs.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}