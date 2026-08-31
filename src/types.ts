export type UserRole = 
  | 'super_admin' 
  | 'mis_admin' 
  | 'manager' 
  | 'sales_manager' 
  | 'logistics_manager' 
  | 'accounts_manager' 
  | 'employee';

export type Department = 
  | 'MIS & IT'
  | 'Sales & Distribution'
  | 'Supply Chain & Logistics'
  | 'Inventory & Logistics'
  | 'Finance & Accounts'
  | 'Finance & Commercial'
  | 'Executive Management'
  | 'Operations'
  | 'Partner Relations'
  | 'Customer Care & DOA';

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department: string;
  phone?: string;
  designation?: string;
  region?: string;
  status: 'active' | 'disabled' | 'suspended';
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export type ReportType = 
  | 'daily_sales'
  | 'monthly_sales'
  | 'stock_inventory'
  | 'dispatch_logistics'
  | 'outstanding_tally'
  | 'partner_performance'
  | 'gst_compliance'
  | 'operational';

export type AccessLevel = 'all' | 'all_authorized' | 'managers_and_up' | 'mis_only' | 'admin_only';

export interface MISReport {
  id: string;
  title: string;
  reportType: ReportType;
  description: string;
  reportingPeriod: string;
  department: string;
  accessLevel: AccessLevel;
  status: 'published' | 'draft' | 'archived';
  fileAttachment?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  uploadedBy: string;
  authorUid: string;
  publishedAt: string;
  createdAt: string;
  summaryMetrics?: {
    totalRevenue?: number;
    totalUnits?: number;
    highlightText?: string;
  };
}

export type AnnouncementPriority = 'normal' | 'important' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  targetAudience: string;
  author?: string;
  authorName?: string;
  authorUid: string;
  isPinned?: boolean;
  expiresAt?: string;
  expiryDate?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  createdAt: string;
}

export type DocumentCategory = 
  | 'mis_reports'
  | 'hr_documents'
  | 'finance'
  | 'operations'
  | 'sales'
  | 'inventory'
  | 'company_documents'
  | 'SOP & Operations'
  | 'Commercial Policies'
  | 'Pricing & Catalogs'
  | 'Legal & GST'
  | 'HR & Admin'
  | 'other';

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  fileType: string;
  fileSize: string;
  url?: string;
  fileUrl?: string;
  accessPermission?: AccessLevel;
  accessLevel?: AccessLevel;
  uploadedBy: string;
  authorUid?: string;
  uploadedByUid?: string;
  department?: string;
  createdAt: string;
  downloadCount?: number;
}

export interface SaleRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  partnerName: string;
  partnerCode: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  salesperson: string;
  region: string;
  paymentStatus: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  minReorderLevel: number;
  unitCost: number;
  warehouseLocation: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastAuditedAt: string;
  updatedAt?: string;
  serialBatch?: string;
}

export type DispatchStatus = 'Pending' | 'Processing' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Cancelled';

export interface DispatchRecord {
  id: string;
  dispatchId: string;
  date: string;
  partnerName: string;
  partnerCode?: string;
  destination: string;
  itemsDescription: string;
  quantity: number;
  status: DispatchStatus;
  carrier: string;
  trackingNumber: string;
  expectedDelivery: string;
  dispatchDate?: string;
  deliveredDate?: string;
  remarks?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  partnerName: string;
  partnerCode: string;
  gstNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  assignedSalesperson: string;
  creditLimit: number;
  outstandingAmount: number;
  paymentTerms: string;
  status: 'Active' | 'On Hold' | 'Review Required' | 'Inactive';
  tier?: string;
  lastTransactionDate: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userEmail?: string;
  userName: string;
  userRole?: UserRole;
  action: string;
  module: string;
  details: string;
  recordId?: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'danger';
}

export interface NotificationItem {
  id: string;
  recipientUid: string;
  title: string;
  message: string;
  link?: string;
  type: 'report' | 'announcement' | 'stock' | 'dispatch' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface ModulePermission {
  module: string;
  name: string;
  description: string;
  super_admin: 'full';
  mis_admin: 'full' | 'limited' | 'view' | 'none';
  manager: 'full' | 'limited' | 'view' | 'none';
  sales_manager?: 'full' | 'limited' | 'view' | 'none';
  logistics_manager?: 'full' | 'limited' | 'view' | 'none';
  accounts_manager?: 'full' | 'limited' | 'view' | 'none';
  employee: 'full' | 'limited' | 'view' | 'none';
}
