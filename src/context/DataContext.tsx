import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  MISReport, 
  Announcement, 
  DocumentItem, 
  SaleRecord, 
  InventoryItem, 
  DispatchRecord, 
  Partner, 
  ActivityLog, 
  NotificationItem,
  UserProfile
} from '../types';
import { 
  INITIAL_REPORTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_SALES, 
  INITIAL_INVENTORY, 
  INITIAL_DISPATCHES, 
  INITIAL_PARTNERS, 
  INITIAL_DOCUMENTS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS
} from '../data/initialDemoData';
import { useAuth } from './AuthContext';
import { 
  db, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc 
} from '../lib/firebase';

interface DataContextType {
  reports: MISReport[];
  announcements: Announcement[];
  sales: SaleRecord[];
  inventory: InventoryItem[];
  dispatches: DispatchRecord[];
  partners: Partner[];
  documents: DocumentItem[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  users: UserProfile[];
  loading: boolean;
  
  // CRUD Actions
  addReport: (report: Omit<MISReport, 'id' | 'createdAt' | 'publishedAt'>) => Promise<MISReport>;
  updateReport: (id: string, updates: Partial<MISReport>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => Promise<Announcement>;
  deleteAnnouncement: (id: string) => Promise<void>;
  
  addSaleRecord: (sale: Omit<SaleRecord, 'id' | 'createdAt'>) => Promise<SaleRecord>;
  deleteSaleRecord: (id: string) => Promise<void>;
  
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<InventoryItem>;
  updateInventoryStock: (id: string, newQuantity: number, reason?: string) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  
  addDispatchRecord: (dispatch: Omit<DispatchRecord, 'id' | 'createdAt'>) => Promise<DispatchRecord>;
  updateDispatchStatus: (id: string, status: DispatchRecord['status'], remarks?: string) => Promise<void>;
  deleteDispatchRecord: (id: string) => Promise<void>;
  
  addPartner: (partner: Omit<Partner, 'id'>) => Promise<Partner>;
  updatePartner: (id: string, updates: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  
  addDocument: (docItem: Omit<DocumentItem, 'id' | 'createdAt'>) => Promise<DocumentItem>;
  deleteDocument: (id: string) => Promise<void>;
  
  addUser: (user: UserProfile) => Promise<void>;
  updateUser: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  updateUserStatus: (uid: string, status: 'active' | 'disabled') => Promise<void>;
  updateUserRole: (uid: string, role: UserProfile['role'], department: UserProfile['department']) => Promise<void>;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  logActivity: (action: string, module: string, details: string, recordId?: string) => void;
  
  // Data Publishing & Batch Import
  importBatchData: (dataset: 'sales' | 'inventory' | 'dispatches' | 'partners' | 'reports', rows: any[]) => Promise<{ imported: number; errors: string[] }>;
  
  // System Tools
  resetToDefaultDemoData: () => Promise<void>;
  resetToInitialDemoData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Storage Keys
const STORAGE_PREFIX = 'ksekpl_mis_';
const getKey = (name: string) => `${STORAGE_PREFIX}${name}`;

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [reports, setReports] = useState<MISReport[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('reports'));
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch { return INITIAL_REPORTS; }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('announcements'));
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch { return INITIAL_ANNOUNCEMENTS; }
  });

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('sales'));
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch { return INITIAL_SALES; }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('inventory'));
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch { return INITIAL_INVENTORY; }
  });

  const [dispatches, setDispatches] = useState<DispatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('dispatches'));
      return saved ? JSON.parse(saved) : INITIAL_DISPATCHES;
    } catch { return INITIAL_DISPATCHES; }
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('partners'));
      return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
    } catch { return INITIAL_PARTNERS; }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('documents'));
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch { return INITIAL_DOCUMENTS; }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('activityLogs'));
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch { return INITIAL_ACTIVITY_LOGS; }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('notifications'));
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch { return INITIAL_NOTIFICATIONS; }
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(getKey('users'));
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch { return INITIAL_USERS; }
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(getKey('reports'), JSON.stringify(reports));
      localStorage.setItem(getKey('announcements'), JSON.stringify(announcements));
      localStorage.setItem(getKey('sales'), JSON.stringify(sales));
      localStorage.setItem(getKey('inventory'), JSON.stringify(inventory));
      localStorage.setItem(getKey('dispatches'), JSON.stringify(dispatches));
      localStorage.setItem(getKey('partners'), JSON.stringify(partners));
      localStorage.setItem(getKey('documents'), JSON.stringify(documents));
      localStorage.setItem(getKey('activityLogs'), JSON.stringify(activityLogs));
      localStorage.setItem(getKey('notifications'), JSON.stringify(notifications));
      localStorage.setItem(getKey('users'), JSON.stringify(users));
    } catch {
      // quota or private mode fallback
    }
  }, [reports, announcements, sales, inventory, dispatches, partners, documents, activityLogs, notifications, users]);

  // Try initial Firestore fetch & seed
  useEffect(() => {
    const initFirestoreSync = async () => {
      try {
        const reportsSnap = await getDocs(collection(db, 'reports'));
        if (!reportsSnap.empty) {
          const loadedReports = reportsSnap.docs.map(d => ({ id: d.id, ...d.data() } as MISReport));
          setReports(loadedReports);
        }
      } catch {
        // Continue with cached/demo state
      }
    };
    initFirestoreSync();
  }, []);

  const logActivity = (action: string, module: string, details: string, recordId?: string) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      userId: currentUser?.uid || 'system',
      userEmail: currentUser?.email || 'system@ksekpl.com',
      userName: currentUser?.displayName || 'System Administrator',
      userRole: currentUser?.role || 'super_admin',
      action,
      module,
      details,
      recordId,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);

    // Try firestore
    try {
      setDoc(doc(db, 'activityLogs', newLog.id), newLog).catch(() => {});
    } catch {}
  };

  const createNotification = (title: string, message: string, link: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      recipientUid: 'all',
      title,
      message,
      link,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- Reports CRUD ---
  const addReport = async (reportData: Omit<MISReport, 'id' | 'createdAt' | 'publishedAt'>): Promise<MISReport> => {
    const id = `REP-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    const now = new Date().toISOString();
    const newReport: MISReport = {
      ...reportData,
      id,
      createdAt: now,
      publishedAt: now
    };

    setReports(prev => [newReport, ...prev]);
    logActivity('REPORT_PUBLISHED', 'MIS Reports', `Published report: ${newReport.title}`, newReport.id);
    createNotification('New MIS Report Published', `${newReport.title} for ${newReport.reportingPeriod}`, 'reports', 'report');

    try {
      await setDoc(doc(db, 'reports', id), newReport);
    } catch {}

    return newReport;
  };

  const updateReport = async (id: string, updates: Partial<MISReport>) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    logActivity('REPORT_UPDATED', 'MIS Reports', `Updated report ID: ${id}`, id);
    try {
      await updateDoc(doc(db, 'reports', id), updates);
    } catch {}
  };

  const deleteReport = async (id: string) => {
    const reportToDelete = reports.find(r => r.id === id);
    setReports(prev => prev.filter(r => r.id !== id));
    logActivity('REPORT_DELETED', 'MIS Reports', `Deleted report: ${reportToDelete?.title || id}`, id);
    try {
      await deleteDoc(doc(db, 'reports', id));
    } catch {}
  };

  // --- Announcements CRUD ---
  const addAnnouncement = async (annData: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> => {
    const id = `ANN-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const newAnn: Announcement = {
      ...annData,
      id,
      createdAt: new Date().toISOString()
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    logActivity('ANNOUNCEMENT_CREATED', 'Announcements', `Posted: ${newAnn.title}`, newAnn.id);
    createNotification(
      newAnn.priority === 'urgent' ? '🚨 Urgent Announcement' : 'New Announcement', 
      newAnn.title, 
      'announcements', 
      'announcement'
    );

    try {
      await setDoc(doc(db, 'announcements', id), newAnn);
    } catch {}

    return newAnn;
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    logActivity('ANNOUNCEMENT_DELETED', 'Announcements', `Deleted announcement ID: ${id}`, id);
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch {}
  };

  // --- Sales CRUD ---
  const addSaleRecord = async (saleData: Omit<SaleRecord, 'id' | 'createdAt'>): Promise<SaleRecord> => {
    const id = `INV-${Date.now().toString().slice(-6)}`;
    const newSale: SaleRecord = {
      ...saleData,
      id,
      createdAt: new Date().toISOString()
    };

    setSales(prev => [newSale, ...prev]);
    logActivity('SALES_ENTRY_CREATED', 'Sales', `Created invoice ${newSale.invoiceNumber} for ${newSale.partnerName} (₹${newSale.totalAmount.toLocaleString('en-IN')})`, newSale.id);

    try {
      await setDoc(doc(db, 'sales', id), newSale);
    } catch {}

    return newSale;
  };

  const deleteSaleRecord = async (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
    logActivity('SALES_ENTRY_DELETED', 'Sales', `Deleted sales invoice ID: ${id}`, id);
    try {
      await deleteDoc(doc(db, 'sales', id));
    } catch {}
  };

  // --- Inventory CRUD ---
  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
    const id = `INV-SKU-${Date.now().toString().slice(-4)}`;
    const newItem: InventoryItem = {
      ...itemData,
      id,
      updatedAt: new Date().toISOString()
    };

    setInventory(prev => [newItem, ...prev]);
    logActivity('INVENTORY_ITEM_ADDED', 'Inventory', `Added SKU ${newItem.sku} - ${newItem.productName} (${newItem.quantity} units)`, newItem.id);

    try {
      await setDoc(doc(db, 'inventory', id), newItem);
    } catch {}

    return newItem;
  };

  const updateInventoryStock = async (id: string, newQuantity: number, reason?: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        let status: InventoryItem['status'] = 'In Stock';
        if (newQuantity <= 0) status = 'Out of Stock';
        else if (newQuantity <= item.minReorderLevel) status = 'Low Stock';

        return {
          ...item,
          quantity: newQuantity,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    logActivity('STOCK_ADJUSTED', 'Inventory', `Adjusted quantity for SKU ${id} to ${newQuantity}. Reason: ${reason || 'Physical count update'}`, id);
    
    try {
      await updateDoc(doc(db, 'inventory', id), { quantity: newQuantity, updatedAt: new Date().toISOString() });
    } catch {}
  };

  const deleteInventoryItem = async (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    logActivity('INVENTORY_ITEM_DELETED', 'Inventory', `Deleted inventory SKU ID: ${id}`, id);
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch {}
  };

  // --- Dispatches CRUD ---
  const addDispatchRecord = async (dspData: Omit<DispatchRecord, 'id' | 'createdAt'>): Promise<DispatchRecord> => {
    const id = `DSP-${Date.now().toString().slice(-6)}`;
    const newDsp: DispatchRecord = {
      ...dspData,
      id,
      createdAt: new Date().toISOString()
    };

    setDispatches(prev => [newDsp, ...prev]);
    logActivity('DISPATCH_CREATED', 'Dispatch Logistics', `Created dispatch ${newDsp.dispatchId} to ${newDsp.partnerName} (${newDsp.quantity} units)`, newDsp.id);
    createNotification('New Dispatch Scheduled', `Dispatch ${newDsp.dispatchId} to ${newDsp.partnerName} (${newDsp.destination})`, 'dispatch', 'dispatch');

    try {
      await setDoc(doc(db, 'dispatches', id), newDsp);
    } catch {}

    return newDsp;
  };

  const updateDispatchStatus = async (id: string, status: DispatchRecord['status'], remarks?: string) => {
    setDispatches(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status,
          remarks: remarks ? `${d.remarks ? d.remarks + ' | ' : ''}${remarks}` : d.remarks,
          deliveredDate: status === 'Delivered' ? new Date().toISOString() : d.deliveredDate
        };
      }
      return d;
    }));

    logActivity('DISPATCH_STATUS_UPDATED', 'Dispatch Logistics', `Updated dispatch ID ${id} status to ${status}`, id);
    
    try {
      await updateDoc(doc(db, 'dispatches', id), { status });
    } catch {}
  };

  const deleteDispatchRecord = async (id: string) => {
    setDispatches(prev => prev.filter(d => d.id !== id));
    logActivity('DISPATCH_DELETED', 'Dispatch Logistics', `Deleted dispatch record ID: ${id}`, id);
    try {
      await deleteDoc(doc(db, 'dispatches', id));
    } catch {}
  };

  // --- Partners CRUD ---
  const addPartner = async (partnerData: Omit<Partner, 'id'>): Promise<Partner> => {
    const id = `PTR-${Date.now().toString().slice(-4)}`;
    const newPartner: Partner = {
      ...partnerData,
      id
    };

    setPartners(prev => [newPartner, ...prev]);
    logActivity('PARTNER_CREATED', 'Partners', `Added partner dealer: ${newPartner.partnerName} (${newPartner.gstNumber})`, newPartner.id);

    try {
      await setDoc(doc(db, 'partners', id), newPartner);
    } catch {}

    return newPartner;
  };

  const updatePartner = async (id: string, updates: Partial<Partner>) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logActivity('PARTNER_UPDATED', 'Partners', `Updated partner profile ID: ${id}`, id);
    try {
      await updateDoc(doc(db, 'partners', id), updates);
    } catch {}
  };

  const deletePartner = async (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    logActivity('PARTNER_DELETED', 'Partners', `Deleted partner ID: ${id}`, id);
    try {
      await deleteDoc(doc(db, 'partners', id));
    } catch {}
  };

  // --- Documents CRUD ---
  const addDocument = async (docData: Omit<DocumentItem, 'id' | 'createdAt'>): Promise<DocumentItem> => {
    const id = `DOC-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = {
      ...docData,
      id,
      createdAt: new Date().toISOString(),
      downloadCount: 0
    };

    setDocuments(prev => [newDoc, ...prev]);
    logActivity('DOCUMENT_UPLOADED', 'Documents', `Uploaded company document: ${newDoc.name}`, newDoc.id);

    try {
      await setDoc(doc(db, 'documents', id), newDoc);
    } catch {}

    return newDoc;
  };

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    logActivity('DOCUMENT_DELETED', 'Documents', `Deleted document ID: ${id}`, id);
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch {}
  };

  // --- Users CRUD ---
  const addUser = async (newUser: UserProfile) => {
    setUsers(prev => [newUser, ...prev]);
    logActivity('USER_CREATED', 'User Management', `Added user account: ${newUser.displayName} (${newUser.email}) with role ${newUser.role}`, newUser.uid);
    try {
      await setDoc(doc(db, 'users', newUser.uid), newUser);
    } catch {}
  };

  const updateUser = async (uid: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...updates } : u));
    logActivity('USER_UPDATED', 'User Management', `Updated profile fields for user ${uid}`, uid);
    try {
      await updateDoc(doc(db, 'users', uid), updates);
    } catch {}
  };

  const deleteUser = async (uid: string) => {
    setUsers(prev => prev.filter(u => u.uid !== uid));
    logActivity('USER_DELETED', 'User Management', `Removed user account: ${uid}`, uid);
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch {}
  };

  const updateUserStatus = async (uid: string, status: 'active' | 'disabled') => {
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status } : u));
    logActivity('USER_STATUS_CHANGED', 'User Management', `Changed user ${uid} status to ${status}`, uid);
    try {
      await updateDoc(doc(db, 'users', uid), { status });
    } catch {}
  };

  const updateUserRole = async (uid: string, role: UserProfile['role'], department: UserProfile['department']) => {
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role, department } : u));
    logActivity('USER_ROLE_CHANGED', 'User Management', `Updated user ${uid} role to ${role} (${department})`, uid);
    try {
      await updateDoc(doc(db, 'users', uid), { role, department });
    } catch {}
  };

  // --- Notifications ---
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // --- Data Publishing & Batch Excel/CSV Import ---
  const importBatchData = async (
    dataset: 'sales' | 'inventory' | 'dispatches' | 'partners' | 'reports', 
    rows: any[]
  ): Promise<{ imported: number; errors: string[] }> => {
    const errors: string[] = [];
    let count = 0;

    try {
      if (dataset === 'sales') {
        const newSales: SaleRecord[] = [];
        rows.forEach((row, idx) => {
          if (!row.invoiceNumber && !row.invoice_number && !row.Invoice) {
            errors.push(`Row ${idx + 1}: Missing invoice number`);
            return;
          }
          const invNo = row.invoiceNumber || row.invoice_number || row.Invoice || `KSE/IMP/${Date.now().toString().slice(-4)}`;
          const partner = row.partnerName || row.partner || row.Customer || 'Authorized Partner';
          const product = row.productName || row.product || row.Item || 'Apple Product';
          const qty = Number(row.quantity || row.qty || 1) || 1;
          const price = Number(row.unitPrice || row.price || row.rate || 50000) || 50000;
          const total = Number(row.totalAmount || row.total || (qty * price));
          
          newSales.push({
            id: `INV-IMP-${Date.now()}-${idx}`,
            invoiceNumber: invNo,
            date: row.date || new Date().toISOString().split('T')[0],
            partnerName: partner,
            partnerCode: row.partnerCode || 'APR-GEN',
            productName: product,
            sku: row.sku || 'SKU-GEN',
            category: row.category || 'iPhone',
            quantity: qty,
            unitPrice: price,
            totalAmount: total,
            salesperson: row.salesperson || currentUser?.displayName || 'MIS Upload',
            region: row.region || 'West',
            paymentStatus: row.paymentStatus || 'Paid',
            createdAt: new Date().toISOString()
          });
          count++;
        });
        setSales(prev => [...newSales, ...prev]);
      } else if (dataset === 'inventory') {
        const newItems: InventoryItem[] = [];
        rows.forEach((row, idx) => {
          if (!row.sku && !row.SKU && !row.productName) {
            errors.push(`Row ${idx + 1}: Missing SKU or Product Name`);
            return;
          }
          newItems.push({
            id: `INV-IMP-${Date.now()}-${idx}`,
            sku: row.sku || row.SKU || `SKU-${Date.now().toString().slice(-4)}`,
            productName: row.productName || row.name || row.Item || 'Apple SKU',
            category: row.category || 'iPhone',
            quantity: Number(row.quantity || row.qty || 0),
            minReorderLevel: Number(row.minReorderLevel || row.minLevel || 50),
            unitCost: Number(row.unitCost || row.cost || 50000),
            warehouseLocation: row.warehouseLocation || row.location || 'Central Warehouse',
            status: Number(row.quantity || 0) <= 0 ? 'Out of Stock' : (Number(row.quantity || 0) < 50 ? 'Low Stock' : 'In Stock'),
            lastAuditedAt: new Date().toISOString().split('T')[0],
            serialBatch: row.serialBatch || `BAT-${new Date().getFullYear()}`
          });
          count++;
        });
        setInventory(prev => [...newItems, ...prev]);
      } else if (dataset === 'dispatches') {
        const newDispatches: DispatchRecord[] = [];
        rows.forEach((row, idx) => {
          newDispatches.push({
            id: `DSP-IMP-${Date.now()}-${idx}`,
            dispatchId: row.dispatchId || `DSP-${Date.now().toString().slice(-5)}`,
            date: row.date || new Date().toISOString().split('T')[0],
            partnerName: row.partnerName || row.partner || 'Partner Store',
            destination: row.destination || row.city || 'Regional Hub',
            itemsDescription: row.itemsDescription || row.items || 'Apple Shipment',
            quantity: Number(row.quantity || row.qty || 1),
            status: row.status || 'Pending',
            carrier: row.carrier || 'Blue Dart Express',
            trackingNumber: row.trackingNumber || row.tracking || `TRK${Date.now().toString().slice(-6)}`,
            expectedDelivery: row.expectedDelivery || new Date().toISOString().split('T')[0],
            remarks: row.remarks || 'Imported via MIS Publisher',
            createdAt: new Date().toISOString()
          });
          count++;
        });
        setDispatches(prev => [...newDispatches, ...prev]);
      } else if (dataset === 'partners') {
        const newPartners: Partner[] = [];
        rows.forEach((row, idx) => {
          newPartners.push({
            id: `PTR-IMP-${Date.now()}-${idx}`,
            partnerName: row.partnerName || row.name || 'Partner Company',
            partnerCode: row.partnerCode || `APR-${Date.now().toString().slice(-4)}`,
            gstNumber: row.gstNumber || row.gst || '27AAACK0000A1Z0',
            contactPerson: row.contactPerson || row.contact || 'Commercials Team',
            phone: row.phone || '+91 90000 00000',
            email: row.email || 'partner@distributor.in',
            city: row.city || 'Mumbai',
            state: row.state || 'Maharashtra',
            assignedSalesperson: row.assignedSalesperson || 'Key Account Manager',
            creditLimit: Number(row.creditLimit || 10000000),
            outstandingAmount: Number(row.outstandingAmount || 0),
            paymentTerms: row.paymentTerms || '30 Days',
            status: row.status || 'Active',
            lastTransactionDate: new Date().toISOString().split('T')[0]
          });
          count++;
        });
        setPartners(prev => [...newPartners, ...prev]);
      }

      logActivity('DATA_BATCH_IMPORTED', 'Data Publisher', `Imported ${count} records into ${dataset} table.`);
    } catch (err: any) {
      errors.push(`Import exception: ${err.message}`);
    }

    return { imported: count, errors };
  };

  const resetToDefaultDemoData = async () => {
    setReports(INITIAL_REPORTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSales(INITIAL_SALES);
    setInventory(INITIAL_INVENTORY);
    setDispatches(INITIAL_DISPATCHES);
    setPartners(INITIAL_PARTNERS);
    setDocuments(INITIAL_DOCUMENTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUsers(INITIAL_USERS);

    logActivity('SYSTEM_RESET_DEMO', 'Settings', 'Reset portal state to fresh Apple Regional Distributor demo datasets.');
  };

  const clearAllData = async () => {
    setReports([]);
    setSales([]);
    setInventory([]);
    setDispatches([]);
    setPartners([]);
    setDocuments([]);
    logActivity('SYSTEM_CLEAR_DATA', 'Settings', 'Cleared all active operational data tables.');
  };

  return (
    <DataContext.Provider value={{
      reports,
      announcements,
      sales,
      inventory,
      dispatches,
      partners,
      documents,
      activityLogs,
      notifications,
      users,
      loading,
      addReport,
      updateReport,
      deleteReport,
      addAnnouncement,
      deleteAnnouncement,
      addSaleRecord,
      deleteSaleRecord,
      addInventoryItem,
      updateInventoryStock,
      deleteInventoryItem,
      addDispatchRecord,
      updateDispatchStatus,
      deleteDispatchRecord,
      addPartner,
      updatePartner,
      deletePartner,
      addDocument,
      deleteDocument,
      addUser,
      updateUser,
      deleteUser,
      updateUserStatus,
      updateUserRole,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      logActivity,
      importBatchData,
      resetToDefaultDemoData,
      resetToInitialDemoData: resetToDefaultDemoData,
      clearAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
