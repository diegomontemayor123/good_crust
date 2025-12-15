import {  CheckCircle,  ShieldAlert } from 'lucide-react';

export default function PartC() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <ShieldAlert className="w-6 h-6 text-emerald-400" />
        Risk Mitigation & Implementation Plan
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-lg border-t-4 border-red-500">
          <h3 className="font-bold mb-2">High Risk: Data Drift</h3>
          <p className="text-sm text-slate-400 mb-4">With two 3PLs and a manual co-packer, DOSS inventory counts will drift from reality.</p>
          <div className="text-xs bg-slate-900 p-2 rounded text-red-300">
            <strong>Mitigation:</strong> Implement a strict weekly "Cycle Count" reconciliation process where 3PL data is treated as truth and overwrites DOSS.
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border-t-4 border-amber-500">
          <h3 className="font-bold mb-2">Med Risk: QBO Clutter</h3>
          <p className="text-sm text-slate-400 mb-4">Syncing every SKU movement to QBO will crash it or make the GL unreadable.</p>
          <div className="text-xs bg-slate-900 p-2 rounded text-amber-300">
            <strong>Mitigation:</strong> Summarized Daily Journal Entries only. No SKU-level data in QBO.
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border-t-4 border-blue-500">
          <h3 className="font-bold mb-2">Low Risk: Shopify API Limits</h3>
          <p className="text-sm text-slate-400 mb-4">High volume drops might hit API rate limits during sync.</p>
          <div className="text-xs bg-slate-900 p-2 rounded text-blue-300">
            <strong>Mitigation:</strong> Use webhooks for real-time updates rather than aggressive polling.
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-600 rounded-full">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Proposed Immediate Next Steps</h3>
            <p className="text-slate-400 text-sm">To kick off this engagement effectively:</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 pl-16">
          <ol className="list-decimal text-slate-300 space-y-2 text-sm">
            <li><strong>Audit 3PL API Docs:</strong> Schedule working session with JackRabbit/Kratos IT to confirm webhooks vs SFTP.</li>
            <li><strong>Define "Truth" Hierarchy:</strong> Sign off on the logic that DOSS wins for Orders, but 3PL wins for Quantity on Hand.</li>
            <li><strong>Co-Packer Template:</strong> Draft the Excel CSV template for the co-packer to approve next week.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}