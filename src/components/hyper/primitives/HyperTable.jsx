import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useHyperPhysics } from '../../../hooks/hyper/useHyperPhysics';

export default function HyperTable({
  columns,
  data,
  onRowClick,
  className = ''
}) {
  const { isHyperUI, performanceMode } = useTheme();
  const { springConfigs } = useHyperPhysics();

  if (!isHyperUI) {
    // Professional Mode Table
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              {columns.map((col, i) => (
                <th key={i} className="p-4 font-medium text-sm">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rIndex) => (
              <tr 
                key={rIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, cIndex) => (
                  <td key={cIndex} className="p-4 text-slate-200">
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // HyperUI Table
  const isBattery = performanceMode === 'battery';
  const baseColor = '59, 130, 246';

  return (
    <div className={`overflow-x-auto rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-md ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-slate-400 bg-black/20">
            {columns.map((col, i) => (
              <th key={i} className="p-4 font-semibold text-sm uppercase tracking-wider">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIndex) => (
            <motion.tr
              key={rIndex}
              initial={!isBattery ? { opacity: 0, y: 10 } : false}
              animate={!isBattery ? { opacity: 1, y: 0 } : false}
              transition={{ ...springConfigs.gentle, delay: rIndex * 0.05 }}
              onClick={() => onRowClick && onRowClick(row)}
              whileHover={{ 
                backgroundColor: 'rgba(255,255,255,0.03)',
                boxShadow: `inset 4px 0 0 rgba(${baseColor}, 0.8)`,
                x: 4
              }}
              className={`border-b border-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, cIndex) => (
                <td key={cIndex} className="p-4 text-slate-200">
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
