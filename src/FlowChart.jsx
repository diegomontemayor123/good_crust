import React from 'react';

// Assuming StepRect is defined or imported as above, including the labelSplit logic
function StepRect({ x, y, width, height, label, labelSplit, fill = '#334155', stroke = '#475569' }) {
    if (labelSplit) {
      const halfWidth = width / 2;
      const splitFill = '#475569'; 
      const splitStroke = '#64748b'; 
      
      return (
        <g>
          <rect x={x} y={y} width={halfWidth} height={height} rx={4} fill={fill} stroke={stroke}/>
          <text x={x + halfWidth / 2} y={y + height / 2} fontSize="10" fill="white" textAnchor="middle" alignmentBaseline="middle">{label}</text>

          <rect x={x + halfWidth} y={y} width={halfWidth} height={height} rx={4} fill={splitFill} stroke={splitStroke}/>
          <text x={x + halfWidth + halfWidth / 2} y={y + height / 2} fontSize="10" fill="white" textAnchor="middle" alignmentBaseline="middle">{labelSplit}</text>
        </g>
      );
    }
    
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} rx={4} fill={fill} stroke={stroke}/>
        <text x={x + width / 2} y={y + height / 2} fontSize="10" fill="white" textAnchor="middle" alignmentBaseline="middle">{label}</text>
      </g>
    );
}

export default function FlowChart() {
  const laneHeight = 62;
  const lanes = [
    { name: 'Co-Packer', y: 0, height: laneHeight, fill: '#1e293b', opacity: 0.3 },
    { name: 'DOSS', y: laneHeight, height: laneHeight, fill: '#1e40af', opacity: 0.1 },
    { name: '3PLs (JackRabbit & Kratos)', y: laneHeight*2, height: laneHeight, fill: '#1e293b', opacity: 0.3 },
    { name: 'QuickBooks Online', y: laneHeight*3, height: laneHeight, fill: '#1e293b', opacity: 0.1 },
    { name: 'Shopify & Wholesale', y: laneHeight*4, height: laneHeight, fill: '#1e293b', opacity: 0.2 }
  ];

  const steps = [
    [{ lane: 'DOSS', label: 'PO Created', y: lanes[1].y + 15, width: 140, height: 20, arrowLeft:'Email (CSV)', fill:'#1e40af', flowType:'manual' }],
    [{ lane: 'Co-Packer', label: 'Co-Packer Produces Goods', y: lanes[0].y + 15, width: 140, height: 20, arrowLeft:'Email (Prod. Receipt)', arrowLeftDx:30, arrowSkipLeft:'Finished Goods', flowType:'manual', arrowSkipLeftDx:35,arrowSkipLeftDy:-8 },
     { lane: 'DOSS', label: 'Production & Orders', y: lanes[1].y + 15, width: 140, height: 20, fill:'#1e40af',arrowRight:'Orders (EDI)', flowType:'edi', arrowRightDx:-30 },
     { lane: 'Shopify & Wholesale', label: 'Shopify', labelSplit: 'Wholesale', y: lanes[4].y + 15, width: 140, height: 20, fill:'#1e293b' }],
    [{ lane: '3PLs (JackRabbit & Kratos)', label: 'JackRabbit', labelSplit: 'Kratos', y: lanes[2].y + 15, width: 160, height: 20, arrowLeft:'FO (EDI)', arrowLeftDx:35, arrowRight:'Tracking (SLA: ≤24hr)',arrowRightDy:-11, arrowRightDx: -35, flowType:'edi' },
     { lane: 'DOSS', label: 'Fulfillment & Confirmation', y: lanes[1].y + 15, width: 140, height: 20, arrowRight:'Summarized Ops (API)', arrowRightDx:60, arrowLeft:'QBO Sync (API)', arrowLeftDx: 0, arrowLeftDy: 60, fill:'#1e40af', flowType:'api' },],
    [{ lane: 'QuickBooks Online', label: 'Financial Events Sync (live)', y: lanes[3].y + 15, width: 140, height: 20, fill:'#d97706', stroke:'#f59e0b' }]
  ];

  const stepPositions = steps.map((s, i) => (i + 0.5) / steps.length);

  return (
    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-hidden">
      <svg viewBox="0 0 1000 300" className="w-full">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#64748b"/>
          </marker>
          <marker id="arrowEdi" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8"/>
          </marker>
        </defs>

        {/* Legend */}
        <line x1="850" y1="10" x2="880" y2="10" stroke="#64748b"/>
        <text x="890" y="12" fontSize="9" fill="#94a3b8">API</text>
        <line x1="850" y1="25" x2="880" y2="25" stroke="#94a3b8" strokeDasharray="4,2"/>
        <text x="890" y="27" fontSize="9" fill="#94a3b8">EDI</text>
        <line x1="850" y1="40" x2="880" y2="40" stroke="#94a3b8" strokeDasharray="2,2"/>
        <text x="890" y="42" fontSize="9" fill="#94a3b8">Manual / CSV / Email</text>

        {/* Lanes */}
        {lanes.map(l => <rect key={l.name} x={0} y={l.y} width={1000} height={l.height} fill={l.fill} opacity={l.opacity}/>)}
        {lanes.map(l => <text key={l.name} x={10} y={l.y + 15} fontSize="12" fill={l.name === 'DOSS' ? '#60a5fa' : '#94a3b8'} fontWeight="bold">{l.name}</text>)}
        
        {/* Step Rects - Now uses updated StepRect */}
        {steps.map((boxes, i) => boxes.map((s, j) => <StepRect key={`${i}-${j}`} {...s} x={stepPositions[i]*1000 - s.width/2}/>))}

        {/* Additional Labels/Annotations */}
        <text x={stepPositions[1]*1000} y={lanes[0].y + 9 } fontSize="8" fill="#a78bfa" textAnchor="middle">Crawl: Weekly Email CSV • Walk: Real-Time Vendor Portal • Run: Automated OCR/EDI</text>
        {/*<text x={stepPositions[3]*1000+20} y={lanes[2].y - 39 } fontSize="8" fill="#94a3b8" textAnchor="middle">DOSS = System of Record for Inventory & Orders</text>*/}
        {/*<text x={stepPositions[0]*1000-62} y={lanes[4].y - 32 } fontSize="8" fill="#94a3b8" textAnchor="middle">System of Record for Finances</text>*/}
        {/* Risks  */}
        <text x={stepPositions[1]*1000 - 70} y={lanes[0].y + 45} fontSize="8" fill="#f87171">Weekly (Lag Risk)</text>
        <text x={stepPositions[1]*1000 - 60} y={lanes[4].y + 45} fontSize="8" fill="#f87171">24h EDI Latency / Chargeback Risk</text>
        <text x={stepPositions[2]*1000 - 57} y={lanes[2].y + 45} fontSize="8" fill="#f87171">Split Shipments & 24h EDI Latency</text>

        {/* Flow of Inventory & Money */}
        <text x={stepPositions[1]*1000 - 45} y={lanes[1].y + 45} fontSize="8" fill="#86efac">Inventory: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Avail. → Res.</text>
        <text x={stepPositions[2]*1000 - 52} y={lanes[3].y -8} fontSize="8" fill="#86efac">Inventory: Reserved → Shipped</text>
        <text x={stepPositions[2]*1000 - 105} y={lanes[3].y + 50} fontSize="8" fill="#86efac">Finished Goods (SLA: ≤5day)</text>
    
        <text x={stepPositions[0]*1000 - 28} y={lanes[1].y + 45} fontSize="8" fill="#fbbf24">($)Future AP</text>
        
        <text x={stepPositions[1]*1000 - 70} y={lanes[1].y +10} fontSize="8" fill="#fbbf24">($)AP Recognized  &nbsp;&nbsp;&nbsp;&nbsp; (on co-packer invoice)</text>
        <text x={stepPositions[1]*1000 - 72} y={lanes[4].y +10} fontSize="8" fill="#fbbf24">($)Pmt Authorized</text>
        <text x={stepPositions[1]*1000 + 10} y={lanes[4].y +10} fontSize="8" fill="#fbbf24">($)Pmt terms set</text>
        <text x={stepPositions[2]*1000 - 68} y={lanes[1].y + 8} fontSize="8" fill="#fbbf24">($)Shipping Costs Recorded (Monthly)</text>
        <text x={stepPositions[3]*1000 -105} y={lanes[3].y + 58} fontSize="8" fill="#fbbf24">($)Inventory Asset→COGS (synced on shipment confirm)</text>
        <text x={stepPositions[3]*1000 - 110} y={lanes[3].y + 48} fontSize="8" fill="#fbbf24">($)DTC Pmt Reconciled & AR Created (on wholesale invoice)</text>

        {/*Independent Box and Arrows*/}
        <StepRect x={stepPositions[2]*1000-70} y={lanes[4].y+15} width={140} height={20} label="Customer Receives Goods"/>
        <line x1={stepPositions[2]*1000} y1={lanes[3].y-5} x2={stepPositions[2]*1000} y2={lanes[4].y+14} stroke="#86efac" strokeDasharray="2,2" markerEnd="url(#arrowEdi)"/>

        {steps.flatMap((boxes, i) => boxes.map((s,j)=>{
          const nextBox = (j < boxes.length - 1) ? boxes[j+1] : (steps[i+1]?.[0] || null);
          const skipBox = (j < boxes.length - 3) ? boxes[j+3] : (j === boxes.length - 3 ? steps[i+1]?.[0] : j === boxes.length - 2 ? steps[i+1]?.[1] : steps[i+1]?.[2]) || (j === boxes.length - 1 ? steps[i+1]?.[2] : null);
          if(!nextBox && !skipBox) return null;
          
          const arrows = [];
          const getFlowStyle = (ft) => ft==='api'?{stroke:'#64748b',dash:'',marker:'url(#arrow)'}:ft==='edi'?{stroke:'#94a3b8',dash:'4,2',marker:'url(#arrowEdi)'}:{stroke:'#94a3b8',dash:'2,2',marker:'url(#arrowEdi)'};
          const flowStyle = getFlowStyle(s.flowType);
          
          // Offset Extractors
          const alDx = s.arrowLeftDx || 0; const alDy = s.arrowLeftDy || 0;
          const arDx = s.arrowRightDx || 0; const arDy = s.arrowRightDy || 0;
          const aslDx = s.arrowSkipLeftDx || 0; const aslDy = s.arrowSkipLeftDy || 0;
          const asrDx = s.arrowSkipRightDx || 0; const asrDy = s.arrowSkipRightDy || 0;

          if(nextBox) {
            const nextStepIdx = j<boxes.length-1?i:i+1;
            const sameCol = i===nextStepIdx;
            const goingDown = nextBox.y>s.y;
            const x1 = sameCol?stepPositions[i]*1000:stepPositions[i]*1000+s.width/2;
            const x2 = sameCol?stepPositions[nextStepIdx]*1000:stepPositions[nextStepIdx]*1000-nextBox.width/2;
            const y1 = sameCol?(goingDown?s.y+s.height:s.y):s.y+s.height/2;
            const y2 = sameCol?(goingDown?nextBox.y:nextBox.y+nextBox.height):nextBox.y+nextBox.height/2;
            const sameLane = Math.abs(y1-y2)<5;
            const midX=(x1+x2)/2, midY=(y1+y2)/2;
            const isHorizontal = sameLane;
            const hasBoth = s.arrowLeft&&s.arrowRight;
            const offset = hasBoth?3:0;
            
            if(sameCol||sameLane){
              const isVertical = sameCol&&!sameLane;
              const off = isVertical?offset:0;
              const offH = isHorizontal?offset:0;
              
              if(s.arrowLeft) arrows.push(<line x1={x1-off} y1={y1-offH} x2={x2-off} y2={y2-offH} stroke={flowStyle.stroke} strokeDasharray={flowStyle.dash} markerEnd={flowStyle.marker}/>);
              if(s.arrowRight) arrows.push(<line x1={x2+off} y1={y2+offH} x2={x1+off} y2={y1+offH} stroke={flowStyle.stroke} strokeDasharray={flowStyle.dash} markerEnd={flowStyle.marker}/>);
              
              if(isHorizontal){
                if(s.arrowLeft) arrows.push(<text x={midX + alDx} y={midY-10 + alDy} fontSize="8" fill="#94a3b8" textAnchor="middle">{s.arrowLeft}</text>);
                if(s.arrowRight) arrows.push(<text x={midX + arDx} y={midY+10 + arDy} fontSize="8" fill="#94a3b8" textAnchor="middle">{s.arrowRight}</text>);
              }else{
                if(s.arrowLeft) arrows.push(<text x={midX-25 + alDx} y={midY-5 + alDy} fontSize="8" fill="#94a3b8">{s.arrowLeft}</text>);
                if(s.arrowRight) arrows.push(<text x={midX+25 + arDx} y={midY+5 + arDy} fontSize="8" fill="#94a3b8" textAnchor="end">{s.arrowRight}</text>);
              }
            }else{
              if(s.arrowLeft) arrows.push(<path d={`M${x1},${y1-offset} C${midX},${y1-offset} ${midX},${y2-offset} ${x2},${y2-offset}`} stroke={"#94a3b8" } strokeDasharray={flowStyle.dash} fill="none" markerEnd={flowStyle.marker}/>, <text x={midX-40 + alDx} y={midY-10 + alDy} fontSize="8" fill={"#94a3b8" }>{s.arrowLeft}</text>);
              if(s.arrowRight) arrows.push(<path d={`M${x2},${y2+offset} C${midX},${y2+offset} ${midX},${y1+offset} ${x1},${y1+offset}`} stroke={"#94a3b8" } strokeDasharray={flowStyle.dash} fill="none" markerEnd={flowStyle.marker}/>, <text x={midX+30 + arDx} y={midY+10 + arDy} fontSize="8" fill={"#94a3b8" } textAnchor="end">{s.arrowRight}</text>);
            }
          }
          if(skipBox) {
            const skipStepIdx = j<boxes.length-3?i:(j===boxes.length-3||j===boxes.length-2||j===boxes.length-1?i+1:i+2);
            const sx1 = stepPositions[i]*1000+s.width/2;
            const sx2 = stepPositions[skipStepIdx]*1000-skipBox.width/2;
            const sy1 = s.y+s.height/2;
            const sy2 = skipBox.y+skipBox.height/2;
            const skipMidX=(sx1+sx2)/2, skipMidY=(sy1+sy2)/2;
            const skipOff = 6;
            if(s.arrowSkipLeft) arrows.push(<path d={`M${sx1},${sy1-skipOff} C${skipMidX},${sy1-skipOff} ${skipMidX},${sy2-skipOff} ${sx2},${sy2-skipOff}`} stroke="#86efac" strokeDasharray="2,2" fill="none" markerEnd="url(#arrowEdi)"/>,<text x={skipMidX-40 + aslDx} y={skipMidY-20 + aslDy} fontSize="8" fill={s.arrowSkipLeft === 'Finished Goods' ? '#86efac':"#94a3b8" }>{s.arrowSkipLeft}</text>);
            if(s.arrowSkipRight) arrows.push(<path d={`M${sx2},${sy2+skipOff} C${skipMidX},${sy2+skipOff} ${skipMidX},${sy1+skipOff} ${sx1},${sy1+skipOff}`} stroke="#94a3b8" strokeDasharray="2,2" fill="none" markerEnd="url(#arrowEdi)"/>, <text x={skipMidX+30 + asrDx} y={skipMidY+20 + asrDy} fontSize="8" fill="#94a3b8" textAnchor="end">{s.arrowSkipRight}</text>);
          }



          
          return <g key={`${i}-${j}`}>{arrows}</g>
        }))}
      </svg>
    </div>
  );
}