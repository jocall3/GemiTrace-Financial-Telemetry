
import React from 'react';

interface AccDetAccNumProps {
  accDtlId?: string;
  prtlAccNum: string;
}

export const AccDetAccNum: React.FC<AccDetAccNumProps> = ({ accDtlId, prtlAccNum }) => {
  const shortId = accDtlId ? accDtlId.substring(0, 4) : '####';
  
  return (
    <div className="flex items-center space-x-2 text-sm text-slate-600">
      <span className="font-bold text-indigo-600">ID: {shortId}</span>
      <span 
        className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 font-mono text-slate-800 shadow-inner"
        data-acc-id={accDtlId}
      >
        {prtlAccNum}
      </span>
    </div>
  );
};
