import React, { useState } from 'react';
import { 
  Megaphone, 
  Search, 
  Filter, 
  PlusCircle, 
  Trash2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Users2,
  BellRing
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Announcement } from '../../types';
import { PublishAnnouncementModal } from './PublishAnnouncementModal';

export const AnnouncementsView: React.FC = () => {
  const { announcements, deleteAnnouncement } = useData();
  const { isMISAdmin, userRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const filteredAnnouncements = announcements.filter(a => {
    const matchSearch = !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());

    const matchPriority = selectedPriority === 'all' || a.priority === selectedPriority;

    return matchSearch && matchPriority;
  });

  return (
    <div id="announcements-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Company Announcements & Bulletins</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official circulars, Apple product launches, price protection updates, logistics advisories, and management notices.
          </p>
        </div>

        {isMISAdmin && (
          <button
            id="post-announcement-btn"
            onClick={() => setIsPublishModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-announcements-input"
            type="text"
            placeholder="Search circulars by headline, keywords, target audience, or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Circulars</option>
            <option value="important">Important Updates</option>
            <option value="normal">General Information</option>
          </select>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="py-16 bg-white rounded-xl border border-slate-200 text-center p-8">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No announcements match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Check back later or post a new announcement.</p>
          </div>
        ) : (
          filteredAnnouncements.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border shadow-xs p-5 transition-all ${
                item.priority === 'urgent' ? 'border-red-300 ring-1 ring-red-100 bg-red-50/20' :
                item.priority === 'important' ? 'border-amber-200' :
                'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    item.priority === 'urgent' ? 'bg-red-600 text-white' :
                    item.priority === 'important' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {item.priority === 'urgent' ? <AlertTriangle className="w-5 h-5 animate-pulse" /> : <Megaphone className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.priority === 'urgent' ? 'bg-red-600 text-white' :
                        item.priority === 'important' ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold' :
                        'bg-slate-100 text-slate-700 font-bold'
                      }`}>
                        {item.priority}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Users2 className="w-3.5 h-3.5 text-slate-400" />
                        Target: {item.targetAudience}
                      </span>
                      <span>•</span>
                      <span>Posted by <strong className="text-slate-700">{item.author}</strong></span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {item.expiresAt && (
                        <>
                          <span>•</span>
                          <span className="text-amber-700 font-medium">Valid until: {item.expiresAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isMISAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete announcement "${item.title}"?`)) {
                        deleteAnnouncement(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {item.content}
              </div>
            </div>
          ))
        )}
      </div>

      {isPublishModalOpen && (
        <PublishAnnouncementModal onClose={() => setIsPublishModalOpen(false)} />
      )}
    </div>
  );
};
