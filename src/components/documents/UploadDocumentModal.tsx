import React, { useState } from 'react';
import { X, FolderLock, Upload, Paperclip, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { AccessLevel } from '../../types';

interface UploadDocumentModalProps {
  onClose: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ onClose }) => {
  const { addDocument } = useData();
  const { currentUser } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('SOP & Operations');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('all_authorized');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ''));
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    setSubmitting(true);
    await addDocument({
      name: name.trim(),
      category,
      description: description.trim(),
      fileUrl: '#',
      fileSize: fileSize || '1.8 MB',
      fileType: 'application/pdf',
      uploadedBy: currentUser?.displayName || 'MIS Admin',
      uploadedByUid: currentUser?.uid || 'mis_admin',
      accessLevel
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Upload Company Document / SOP</h2>
              <p className="text-xs text-slate-300">Secure Internal Archival Storage</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Apple DOA Replacement & Service Claim SOP v3.2"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="SOP & Operations">SOP & Operations</option>
                <option value="Commercial Policies">Commercial Policies</option>
                <option value="Pricing & Catalogs">Pricing & Catalogs</option>
                <option value="Legal & GST">Legal & GST Compliance</option>
                <option value="HR & Admin">HR & Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Access Level *</label>
              <select
                value={accessLevel}
                onChange={e => setAccessLevel(e.target.value as AccessLevel)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all_authorized">All Authorized Personnel</option>
                <option value="managers_and_up">Managers & Above</option>
                <option value="mis_only">MIS Department Only</option>
                <option value="admin_only">Super Admin Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Scope *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Summary of document rules, applicability, revision notes, or guidelines..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select File (PDF, DOCX, XLSX)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileInput}
                accept=".pdf,.docx,.xlsx,.doc,.pptx"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              {fileName ? (
                <div className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1.5">
                  <Paperclip className="w-4 h-4" />
                  <span>{fileName} ({fileSize})</span>
                </div>
              ) : (
                <p className="text-xs font-medium text-slate-700">
                  Click or drag file to attach (Max 50MB)
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Uploading...' : 'Save Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
