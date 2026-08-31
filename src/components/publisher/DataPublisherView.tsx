import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Table, 
  RefreshCw, 
  Sparkles,
  Info
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const DataPublisherView: React.FC = () => {
  const { importBatchData } = useData();
  const { isMISAdmin } = useAuth();

  const [targetDataset, setTargetDataset] = useState<'sales' | 'inventory' | 'dispatches' | 'partners'>('sales');
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [rawText, setRawText] = useState('');
  const [importing, setImporting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ count: number; errors: string[] } | null>(null);

  const sampleTemplates: Record<string, { headers: string[]; sampleRow: string }> = {
    sales: {
      headers: ['invoiceNumber', 'date', 'partnerName', 'partnerCode', 'productName', 'sku', 'category', 'quantity', 'unitPrice', 'totalAmount', 'salesperson', 'region', 'paymentStatus'],
      sampleRow: 'KSE/2026/0491,2026-08-29,Unicorn Infosolutions,APR-UNI-01,iPhone 16 Pro 256GB Desert Titanium,MYWL3HN/A,iPhone,10,134900,1349000,Rajesh Mehta,West,Paid'
    },
    inventory: {
      headers: ['sku', 'productName', 'category', 'quantity', 'minReorderLevel', 'unitCost', 'warehouseLocation', 'serialBatch'],
      sampleRow: 'MYWW3HN/A,iPhone 16 Pro 512GB Natural Titanium,iPhone,35,15,144900,Mumbai Central Hub (Bhiwandi),BAT-2026-Q3-091'
    },
    dispatches: {
      headers: ['dispatchId', 'date', 'partnerName', 'destination', 'itemsDescription', 'quantity', 'carrier', 'trackingNumber', 'status', 'expectedDelivery', 'remarks'],
      sampleRow: 'DSP-2026-0921,2026-08-29,Imagine Tresor Systems,Chandigarh,15x MacBook Air M3,15,Blue Dart Express Priority,BD-99887711,In Transit,2026-08-31,Standard insured dispatch'
    },
    partners: {
      headers: ['partnerName', 'partnerCode', 'gstNumber', 'contactPerson', 'phone', 'email', 'city', 'state', 'assignedSalesperson', 'creditLimit', 'outstandingAmount', 'paymentTerms', 'status'],
      sampleRow: 'Reliance Retail Digital,LFR-REL-01,27AABCR1234F1Z5,Sunil Verma,+91 98200 11223,reliance@applepartner.in,Mumbai,Maharashtra,Rajesh Mehta,50000000,12000000,30 Days Net,Active'
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setResultMessage(null);

      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'csv') {
        Papa.parse(selectedFile, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setParsedHeaders(Object.keys(results.data[0] as object));
              setParsedRows(results.data);
            }
          }
        });
      } else if (ext === 'xlsx' || ext === 'xls') {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
          if (data.length > 0) {
            const headers = data[0] as string[];
            setParsedHeaders(headers);
            const rows = data.slice(1).map(rowArr => {
              const obj: any = {};
              headers.forEach((h, idx) => {
                obj[h] = rowArr[idx];
              });
              return obj;
            });
            setParsedRows(rows);
          }
        };
        reader.readAsBinaryString(selectedFile);
      }
    }
  };

  const handleParseRawText = () => {
    if (!rawText.trim()) return;
    setResultMessage(null);
    Papa.parse(rawText.trim(), {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setParsedHeaders(Object.keys(results.data[0] as object));
          setParsedRows(results.data);
        }
      }
    });
  };

  const handleDownloadSample = () => {
    const tmpl = sampleTemplates[targetDataset];
    const csvContent = 'data:text/csv;charset=utf-8,' + [tmpl.headers.join(','), tmpl.sampleRow].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sample_KSE_${targetDataset}_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    const res = await importBatchData(targetDataset, parsedRows);
    setImporting(false);
    setResultMessage({ count: res.imported, errors: res.errors });
    setParsedRows([]);
    setFile(null);
    setRawText('');
  };

  return (
    <div id="data-publisher-studio" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              MIS Data Publisher & Batch Import Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bulk ingest daily Tally sales bills, SAP inventory snapshots, 3PL dispatch consignments, and dealer masters via Excel or CSV.
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download {targetDataset.toUpperCase()} Template</span>
        </button>
      </div>

      {/* Target Dataset Selection */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Step 1: Select Target Database Collection
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'sales', title: 'Sales Invoices', desc: 'Daily billing & partner orders' },
            { id: 'inventory', title: 'Inventory Stock', desc: 'SKU counts & warehouse levels' },
            { id: 'dispatches', title: 'Dispatch Logistics', desc: 'Carrier shipments & AWB' },
            { id: 'partners', title: 'Partner Directory', desc: 'Dealer accounts & GST' }
          ].map(ds => (
            <button
              key={ds.id}
              onClick={() => {
                setTargetDataset(ds.id as any);
                setParsedRows([]);
                setFile(null);
                setResultMessage(null);
              }}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                targetDataset === ds.id
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-xs text-slate-900">{ds.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{ds.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload or Raw Paste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Option A: Upload File */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Step 2A: Upload .XLSX / .CSV File
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer relative">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            {file ? (
              <div className="text-xs font-bold text-blue-600">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-slate-700">Click to browse or drop Excel / CSV file</p>
                <p className="text-[11px] text-slate-400 mt-1">Directly import reports exported from Tally ERP, SAP or Excel</p>
              </>
            )}
          </div>
        </div>

        {/* Option B: Direct CSV / TSV Paste */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 2B: Or Paste Raw CSV / Tab Text
              </label>
              <button
                type="button"
                onClick={() => setRawText([sampleTemplates[targetDataset].headers.join(','), sampleTemplates[targetDataset].sampleRow].join('\n'))}
                className="text-[10px] text-blue-600 font-semibold hover:underline"
              >
                Paste Sample Row
              </button>
            </div>
            <textarea
              rows={4}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste comma-separated or tab-separated data including column header row..."
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleParseRawText}
            disabled={!rawText.trim()}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Parse Pasted Table Text
          </button>
        </div>
      </div>

      {/* Result Status Message */}
      {resultMessage && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          resultMessage.count > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
        }`}>
          {resultMessage.count > 0 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <h4 className="font-bold">
              {resultMessage.count > 0 ? `Successfully imported ${resultMessage.count} records into ${targetDataset}!` : 'Batch import encountered issues'}
            </h4>
            {resultMessage.errors.length > 0 && (
              <ul className="list-disc list-inside mt-1 text-[11px] text-red-700">
                {resultMessage.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Data Preview Table */}
      {parsedRows.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Step 3: Staging Data Verification ({parsedRows.length} Rows Detected)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review matched headers and row values before publishing to live company database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setParsedRows([])}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Clear
              </button>
              <button
                id="execute-import-btn"
                onClick={handleExecuteImport}
                disabled={importing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {importing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing to Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Confirm & Import {parsedRows.length} Rows</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  {parsedHeaders.map((h, i) => (
                    <th key={i} className="px-3 py-2 whitespace-nowrap text-[11px] font-mono">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {parsedRows.slice(0, 10).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50">
                    {parsedHeaders.map((h, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap">
                        {String(row[h] !== undefined ? row[h] : '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedRows.length > 10 && (
            <p className="text-[11px] text-slate-400 text-center">
              + {parsedRows.length - 10} more rows staged in memory
            </p>
          )}
        </div>
      )}
    </div>
  );
};
