import React, { useState } from 'react';
import { 
  FolderLock, 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  Eye, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  Lock, 
  FileCode,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DocumentItem } from '../../types';
import { UploadDocumentModal } from './UploadDocumentModal';

export const DocumentsView: React.FC = () => {
  const { documents, deleteDocument } = useData();
  const { isMISAdmin, canEdit, userRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    // Access control
    if (doc.accessLevel === 'admin_only' && userRole !== 'super_admin') return false;
    if (doc.accessLevel === 'mis_only' && !isMISAdmin) return false;
    if (doc.accessLevel === 'managers_and_up' && userRole === 'employee') return false;

    const matchSearch = !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const handleDownload = (doc: DocumentItem) => {
    const text = `=====================================================
KS ENTERPRISES (KMR) PRIVATE LIMITED
DOCUMENT REPOSITORY - VERIFIED FILE
=====================================================
Document: ${doc.name}
Category: ${doc.category}
Uploaded by: ${doc.uploadedBy}
Date: ${new Date(doc.createdAt).toLocaleDateString()}
Description: ${doc.description}
=====================================================
CONFIDENTIAL & PROPRIETARY INTERNAL ARCHIVE.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="documents-repository-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Company Documents & SOP Repository</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard operating procedures, Apple distribution contracts, price books, GST certificates, and credit policy frameworks.
          </p>
        </div>

        {canEdit('documents') && (
          <button
            id="upload-document-btn"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-documents-input"
            type="text"
            placeholder="Search document title, category, description, or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Document Categories</option>
            <option value="SOP & Operations">SOP & Operations</option>
            <option value="Commercial Policies">Commercial Policies</option>
            <option value="Pricing & Catalogs">Pricing & Catalogs</option>
            <option value="Legal & GST">Legal & GST Compliance</option>
            <option value="HR & Admin">HR & Admin</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-xl border border-slate-200 text-center p-8">
            <FolderLock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No documents found matching criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search filters or upload a document.</p>
          </div>
        ) : (
          filteredDocuments.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{doc.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{doc.description}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">{doc.fileSize}</span>
                  <span className="block text-[10px] text-slate-400">By {doc.uploadedBy}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  {isMISAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete document "${doc.name}"?`)) {
                          deleteDocument(doc.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isUploadModalOpen && (
        <UploadDocumentModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
};
