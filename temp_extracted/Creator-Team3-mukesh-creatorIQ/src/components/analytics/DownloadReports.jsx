import React, { useState } from 'react';
import { FileText, FileSpreadsheet, FileDown, Printer, Calendar, Filter, CheckCircle } from 'lucide-react';

export default function DownloadReports() {
  const [dateRange, setDateRange] = useState('2026-07-01');
  const [platform, setPlatform] = useState('All Platforms');
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = (type) => {
    if (type === 'print') {
      window.print();
      return;
    }

    setStatusMessage(`Exporting ${platform} analytics report as ${type.toUpperCase()}...`);

    if (type === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8,Date,Platform,Revenue,Views,RPM\n2026-07-01,YouTube,10200,2100000,4.8\n2026-07-01,Instagram,4500,1800000,2.5\n";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CreatorIQ_Revenue_Report_${platform.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      setStatusMessage(`✅ ${type.toUpperCase()} Report generated and downloaded successfully!`);
      setTimeout(() => setStatusMessage(''), 4000);
    }, 1000);
  };

  return (
    <div className="theme-card" style={{ padding: '22px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileDown size={20} color="var(--accent-primary)" />
          Download & Export Analytics Reports
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
          Generate, filter, and export comprehensive platform revenue & audience performance reports
        </p>
      </div>

      {statusMessage && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#10b981',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={16} />
          {statusMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Select Start Date
          </label>
          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Platform Filter
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          >
            <option>All Platforms</option>
            <option>YouTube</option>
            <option>Instagram</option>
            <option>LinkedIn</option>
            <option>Twitter / X</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
        <button
          type="button"
          onClick={() => handleExport('pdf')}
          style={{
            padding: '18px 12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3))',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          <FileText size={28} color="#ef4444" />
          <span>Download PDF</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport('excel')}
          style={{
            padding: '18px 12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          <FileSpreadsheet size={28} color="#10b981" />
          <span>Export Excel</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport('csv')}
          style={{
            padding: '18px 12px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          <FileDown size={28} color="#3b82f6" />
          <span>Export CSV</span>
        </button>

        <button
          type="button"
          onClick={() => handleExport('print')}
          style={{
            padding: '18px 12px',
            borderRadius: '12px',
            background: 'rgba(51, 65, 85, 0.6)',
            border: '1px solid var(--border-primary)',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          <Printer size={28} color="#94a3b8" />
          <span>Print Report</span>
        </button>
      </div>
    </div>
  );
}
