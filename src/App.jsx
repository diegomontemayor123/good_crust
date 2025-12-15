import React, { useState } from 'react';
import PartA from './a';
import PartB from './b';
import PartC from './c';

const PW="goodcrust2025"



export default function GoodCrustCaseStudy() {

    const [ok,setOk]=useState(sessionStorage.ok==="1"),[pw,setPw]=useState(""),[activeTab,setActiveTab]=useState("partA")
    if(!ok)return<div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100"><div className="bg-slate-900 p-6 rounded-xl border border-slate-800"><div className="text-sm text-slate-400 mb-2">Password</div><input type="password" className="bg-slate-800 p-2 rounded mr-2"/><button onClick={e=>{const v=e.currentTarget.previousSibling.value;v===PW&&(sessionStorage.ok="1",setOk(true))}} className="bg-blue-600 px-3 py-2 rounded">Enter</button></div></div>


  

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto p-3">
        {/* Header Section */}
        <header className="mb-2 border-b border-slate-800 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                GoodCrust Foods
              </h1>
              <h2 className="text-xl text-slate-400 font-medium">ERP Implementation Strategy & System Design</h2>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Candidate: Diego Montemayor</div>
              <div>Date: Dec 2025</div>
            </div>
          </div>
          
          <div className="mt-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Guiding Principle</h3>
            <p className="text-slate-300 italic">
              Establish DOSS as the <strong className="text-white">Operational SoT</strong> for inventory and fulfillment, maintain QBO strictly as the <strong className="text-white">Financial SoT</strong>. Decouple high-velocity operational data from General Ledger.
            </p>
          </div>
        </header>

        {/* Navigation */}
        <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg inline-flex mb-2">
          <button 
            onClick={() => setActiveTab('partA')} 
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'partA' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Part A: Process Flow
          </button>
          <button 
            onClick={() => setActiveTab('partB')} 
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'partB' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Part B: Architecture & Schema
          </button>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl pt-4 px-8 pb-8 shadow-2xl">
          {activeTab === 'partA' && <PartA />}
          {activeTab === 'partB' && <PartB />}
        </div>
      </div>
    </div>
  );
}

PartA();
PartB()
PartC()