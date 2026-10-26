import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import VulnerabilityChart from '../../components/charts/VulnerabilityChart';
import EducationChart from '../../components/charts/EducationChart';
import SchemeChart from '../../components/charts/SchemeChart';
import { Download, Printer } from 'lucide-react';
import { reportAPI } from '../../services/api';

const csvCell = value => {
  let text = String(value ?? '');
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

function downloadReport(stats) {
  const generatedAt = new Date();
  const rows = [
    ['InvisibleAid'],
    ['Reports & Analytics'],
    ['Generated', generatedAt.toLocaleString()],
    [],
    ['SUMMARY'],
    ['Metric', 'Value'],
    ['Total beneficiaries', stats.total_beneficiaries ?? 0],
    ['Assessments completed', stats.assessments_completed ?? 0],
    ['High vulnerability', stats.high_vulnerability ?? 0],
    ['Successful interventions', stats.successful_interventions ?? 0],
    [],
    ['VULNERABILITY DISTRIBUTION'],
    ['Level', 'Beneficiary count'],
    ...(stats.vulnerability_distribution || []).map(item => [item.name, item.value]),
    [],
    ['EDUCATION DISTRIBUTION'],
    ['Education level', 'Beneficiary count'],
    ...(stats.education_distribution || []).map(item => [item.level, item.count]),
    [],
    ['TOP RECOMMENDED SCHEMES'],
    ['Scheme', 'Recommendation count'],
    ...(stats.scheme_recommendations || []).map(item => [item.name, item.count])
  ];
  const contents = `\uFEFF${rows.map(row => row.map(csvCell).join(',')).join('\r\n')}`;
  const file = new Blob([contents], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = `InvisibleAid-Report-${generatedAt.toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[character]));

const printTable = (heading, headers, rows) => `
  <section>
    <h2>${escapeHtml(heading)}</h2>
    <table>
      <thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
      <tbody>${rows.length
        ? rows.map(row => `<tr>${row.map(value => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`).join('')
        : `<tr><td colspan="${headers.length}" class="empty">No data available</td></tr>`}
      </tbody>
    </table>
  </section>`;

function printReport(stats) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const generatedAt = new Date().toLocaleString();
  const summary = [
    ['Total beneficiaries', stats.total_beneficiaries ?? 0],
    ['Assessments completed', stats.assessments_completed ?? 0],
    ['High vulnerability', stats.high_vulnerability ?? 0],
    ['Successful interventions', stats.successful_interventions ?? 0]
  ];
  const content = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>InvisibleAid Reports & Analytics</title>
        <style>
          :root { color-scheme: light; font-family: Arial, sans-serif; color: #1f2937; }
          body { max-width: 960px; margin: 40px auto; padding: 0 28px; }
          header { display: flex; align-items: center; gap: 14px; padding-bottom: 18px; border-bottom: 3px solid #0f766e; }
          .mark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 10px; background: #0f766e; }
          .mark svg { width: 26px; height: 26px; }
          .brand { margin: 0; color: #115e59; font-size: 24px; }
          .subtitle { margin: 4px 0 0; color: #64748b; font-size: 13px; }
          .generated { margin: 20px 0; color: #64748b; font-size: 12px; }
          section { margin: 24px 0; break-inside: avoid; }
          h2 { margin: 0 0 10px; color: #115e59; font-size: 15px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #dbe3e8; padding: 9px 11px; text-align: left; overflow-wrap: anywhere; }
          th { background: #f0fdfa; color: #134e4a; }
          tr:nth-child(even) td { background: #f8fafc; }
          .empty { color: #64748b; }
          footer { border-top: 1px solid #dbe3e8; padding-top: 12px; color: #64748b; font-size: 10px; }
          @page { size: auto; margin: 16mm; }
          @media print { body { margin: 0 auto; padding: 0; } }
        </style>
      </head>
      <body>
        <header>
          <div class="mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.5 20 5.5v5.7c0 5.1-3.2 8.6-8 10.3-4.8-1.7-8-5.2-8-10.3V5.5l8-3Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="m8 12 2.5 2.5L16.5 9" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div><h1 class="brand">InvisibleAid</h1><p class="subtitle">Reports &amp; Analytics</p></div>
        </header>
        <p class="generated">Generated ${escapeHtml(generatedAt)}</p>
        ${printTable('Summary', ['Metric', 'Value'], summary)}
        ${printTable('Vulnerability Distribution', ['Level', 'Beneficiary count'],
          (stats.vulnerability_distribution || []).map(item => [item.name, item.value]))}
        ${printTable('Education Distribution', ['Education level', 'Beneficiary count'],
          (stats.education_distribution || []).map(item => [item.level, item.count]))}
        ${printTable('Top Recommended Schemes', ['Scheme', 'Recommendation count'],
          (stats.scheme_recommendations || []).map(item => [item.name, item.count]))}
        <footer>InvisibleAid • Preliminary decision-support information. Verify eligibility against official scheme guidelines.</footer>
      </body>
    </html>`;
  printWindow.document.open();
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
  return true;
}

export default function ReportsPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    reportAPI.getDashboardStats()
      .then(setStats)
      .catch(apiError => setError(apiError.message || 'Unable to load reports.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {loading && <div className="text-sm text-gray-500">Loading reports...</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {exportMessage && <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{exportMessage}</div>}
      <PageHeader 
        title="Reports & Analytics" 
        actions={[
          { label: 'Save as PDF', icon: Printer, variant: 'primary', disabled: loading, onClick: () => {
            setExportMessage(printReport(stats) ? '' : 'Allow pop-ups to open the print-ready PDF report.');
          } },
          { label: 'Export CSV', icon: Download, disabled: loading, onClick: () => downloadReport(stats) }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card><div className="text-sm text-gray-500">Total Beneficiaries</div><div className="text-2xl font-bold">{stats.total_beneficiaries ?? 0}</div></Card>
         <Card><div className="text-sm text-gray-500">Assessments Completed</div><div className="text-2xl font-bold">{stats.assessments_completed ?? 0}</div></Card>
         <Card><div className="text-sm text-gray-500">High Vulnerability</div><div className="text-2xl font-bold text-red-600">{stats.high_vulnerability ?? 0}</div></Card>
         <Card><div className="text-sm text-gray-500">Successful Interventions</div><div className="text-2xl font-bold text-green-600">{stats.successful_interventions ?? 0}</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Vulnerability Distribution">
          <VulnerabilityChart data={stats.vulnerability_distribution || []} />
        </Card>
        
        <Card title="Education Levels">
          <EducationChart data={stats.education_distribution || []} />
        </Card>
      </div>

      <Card title="Top Recommended Schemes">
        <SchemeChart data={stats.scheme_recommendations || []} />
      </Card>
    </div>
  );
}
