'use client'

import * as React from 'react'

// ============ Types ============
export interface Client {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  website: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'LEAD'
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  clientId: string
  name: string
  description: string | null
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  budget: number | null
  deadline: string | null
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  clientId: string
  projectId: string | null
  number: string
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOID'
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  total: number
  paid: number
  notes: string | null
  items: InvoiceItem[]
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Proposal {
  id: string
  clientId: string
  projectId: string | null
  name: string
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'DECLINED'
  total: number
  validityDays: number
  viewedAt: string | null
  notes: string | null
  items: ProposalItem[]
  createdAt: string
  updatedAt: string
}

export interface ProposalItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Contract {
  id: string
  clientId: string
  projectId: string | null
  name: string
  status: 'DRAFT' | 'SENT' | 'SIGNED' | 'EXPIRED' | 'VOID'
  value: number
  signedAt: string | null
  expiresAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  clientId: string
  invoiceId: string | null
  amount: number
  method: 'BANK_TRANSFER' | 'CARD' | 'PAYPAL' | 'CASH' | 'CHECK' | 'OTHER'
  reference: string | null
  date: string
  notes: string | null
  createdAt: string
}

export interface Activity {
  id: string
  clientId: string
  projectId: string | null
  type: 'CLIENT_CREATED' | 'PROJECT_CREATED' | 'INVOICE_SENT' | 'INVOICE_PAID' |
        'PROPOSAL_SENT' | 'PROPOSAL_VIEWED' | 'PROPOSAL_ACCEPTED' | 'CONTRACT_SIGNED' |
        'MESSAGE_SENT' | 'MESSAGE_RECEIVED' | 'NOTE_ADDED' | 'PAYMENT_RECEIVED'
  description: string
  createdAt: string
}

export interface Message {
  id: string
  clientId: string
  content: string
  isFromClient: boolean
  createdAt: string
}

export interface AppData {
  clients: Client[]
  projects: Project[]
  invoices: Invoice[]
  proposals: Proposal[]
  contracts: Contract[]
  payments: Payment[]
  activities: Activity[]
  messages: Message[]
}

const STORAGE_KEY = 'freelancer-crm-data'

const defaultData: AppData = {
  clients: [],
  projects: [],
  invoices: [],
  proposals: [],
  contracts: [],
  payments: [],
  activities: [],
  messages: [],
}

// Seed data
const seedData: AppData = {
  clients: [
    {
      id: 'c1',
      name: 'Sarah Mitchell',
      email: 'sarah@acmestudio.com',
      company: 'Acme Studio',
      phone: '+1 555-0123',
      website: 'acmestudio.com',
      status: 'ACTIVE',
      notes: 'Great client, prefers email communication',
      createdAt: '2024-01-15',
      updatedAt: '2024-09-01',
    },
    {
      id: 'c2',
      name: 'James Chen',
      email: 'james@techstart.io',
      company: 'TechStart',
      phone: '+1 555-0456',
      website: 'techstart.io',
      status: 'ACTIVE',
      notes: 'Mobile app project in progress',
      createdAt: '2024-03-20',
      updatedAt: '2024-08-28',
    },
    {
      id: 'c3',
      name: 'Emma Rodriguez',
      email: 'emma@creativelabs.co',
      company: 'Creative Labs',
      phone: '+1 555-0789',
      website: 'creativelabs.co',
      status: 'ACTIVE',
      notes: 'Long-term retainer client',
      createdAt: '2023-11-10',
      updatedAt: '2024-09-02',
    },
    {
      id: 'c4',
      name: 'Michael Park',
      email: 'michael@growthlab.com',
      company: 'Growth Lab',
      phone: '+1 555-0234',
      website: 'growthlab.com',
      status: 'INACTIVE',
      notes: 'Paused project due to budget constraints',
      createdAt: '2024-02-14',
      updatedAt: '2024-06-15',
    },
    {
      id: 'c5',
      name: 'Lisa Thompson',
      email: 'lisa@designhouse.studio',
      company: 'Design House',
      phone: '+1 555-0567',
      website: 'designhouse.studio',
      status: 'ACTIVE',
      notes: 'New client, first project starting soon',
      createdAt: '2024-08-28',
      updatedAt: '2024-09-01',
    },
    {
      id: 'c6',
      name: 'David Kim',
      email: 'david@cloudops.net',
      company: 'CloudOps',
      phone: '+1 555-0890',
      website: 'cloudops.net',
      status: 'ACTIVE',
      notes: 'Enterprise client, quarterly billing',
      createdAt: '2023-06-01',
      updatedAt: '2024-09-03',
    },
  ],
  projects: [
    {
      id: 'p1',
      clientId: 'c1',
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with new branding',
      status: 'ACTIVE',
      budget: 15000,
      deadline: '2024-12-31',
      createdAt: '2024-01-20',
      updatedAt: '2024-09-01',
    },
    {
      id: 'p2',
      clientId: 'c2',
      name: 'Mobile App MVP',
      description: 'iOS and Android app for startup MVP',
      status: 'ACTIVE',
      budget: 45000,
      deadline: '2024-11-15',
      createdAt: '2024-03-25',
      updatedAt: '2024-08-28',
    },
    {
      id: 'p3',
      clientId: 'c5',
      name: 'Brand Identity',
      description: 'Logo, color palette, typography, brand guidelines',
      status: 'PLANNING',
      budget: 8000,
      deadline: '2024-10-30',
      createdAt: '2024-08-28',
      updatedAt: '2024-09-01',
    },
    {
      id: 'p4',
      clientId: 'c6',
      name: 'Infrastructure Audit',
      description: 'Comprehensive audit of cloud infrastructure',
      status: 'ACTIVE',
      budget: 12000,
      deadline: '2024-09-30',
      createdAt: '2024-06-15',
      updatedAt: '2024-09-03',
    },
  ],
  invoices: [
    {
      id: 'i1',
      clientId: 'c1',
      projectId: 'p1',
      number: 'INV-2024-001',
      status: 'PAID',
      issueDate: '2024-07-15',
      dueDate: '2024-08-01',
      subtotal: 8500,
      tax: 0,
      total: 8500,
      paid: 8500,
      notes: null,
      items: [{ id: 'ii1', description: 'Website redesign - Phase 1', quantity: 1, rate: 8500, amount: 8500 }],
      createdAt: '2024-07-15',
      updatedAt: '2024-08-05',
    },
    {
      id: 'i2',
      clientId: 'c1',
      projectId: 'p1',
      number: 'INV-2024-002',
      status: 'SENT',
      issueDate: '2024-08-15',
      dueDate: '2024-09-15',
      subtotal: 4200,
      tax: 0,
      total: 4200,
      paid: 0,
      notes: null,
      items: [{ id: 'ii2', description: 'Website redesign - Phase 2', quantity: 1, rate: 4200, amount: 4200 }],
      createdAt: '2024-08-15',
      updatedAt: '2024-08-15',
    },
    {
      id: 'i3',
      clientId: 'c2',
      projectId: 'p2',
      number: 'INV-2024-003',
      status: 'PAID',
      issueDate: '2024-06-15',
      dueDate: '2024-07-01',
      subtotal: 15000,
      tax: 0,
      total: 15000,
      paid: 15000,
      notes: null,
      items: [{ id: 'ii3', description: 'Mobile app - Sprint 1-3', quantity: 1, rate: 15000, amount: 15000 }],
      createdAt: '2024-06-15',
      updatedAt: '2024-07-01',
    },
    {
      id: 'i4',
      clientId: 'c2',
      projectId: 'p2',
      number: 'INV-2024-004',
      status: 'OVERDUE',
      issueDate: '2024-07-15',
      dueDate: '2024-08-15',
      subtotal: 18000,
      tax: 0,
      total: 18000,
      paid: 5000,
      notes: null,
      items: [{ id: 'ii4', description: 'Mobile app - Sprint 4-6', quantity: 1, rate: 18000, amount: 18000 }],
      createdAt: '2024-07-15',
      updatedAt: '2024-08-20',
    },
    {
      id: 'i5',
      clientId: 'c3',
      projectId: null,
      number: 'INV-2024-005',
      status: 'PAID',
      issueDate: '2024-09-01',
      dueDate: '2024-09-01',
      subtotal: 5000,
      tax: 0,
      total: 5000,
      paid: 5000,
      notes: 'Monthly retainer',
      items: [{ id: 'ii5', description: 'September retainer', quantity: 1, rate: 5000, amount: 5000 }],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01',
    },
    {
      id: 'i6',
      clientId: 'c6',
      projectId: 'p4',
      number: 'INV-2024-007',
      status: 'PAID',
      issueDate: '2024-07-01',
      dueDate: '2024-07-01',
      subtotal: 25000,
      tax: 0,
      total: 25000,
      paid: 25000,
      notes: 'Q3 infrastructure',
      items: [{ id: 'ii6', description: 'Infrastructure audit Q3', quantity: 1, rate: 25000, amount: 25000 }],
      createdAt: '2024-07-01',
      updatedAt: '2024-07-01',
    },
    {
      id: 'i7',
      clientId: 'c6',
      projectId: 'p4',
      number: 'INV-2024-008',
      status: 'SENT',
      issueDate: '2024-09-01',
      dueDate: '2024-10-01',
      subtotal: 25000,
      tax: 0,
      total: 25000,
      paid: 0,
      notes: 'Q4 infrastructure',
      items: [{ id: 'ii7', description: 'Infrastructure audit Q4', quantity: 1, rate: 25000, amount: 25000 }],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-01',
    },
  ],
  proposals: [
    {
      id: 'pr1',
      clientId: 'c1',
      projectId: null,
      name: 'Brand Refresh',
      status: 'VIEWED',
      total: 12000,
      validityDays: 30,
      viewedAt: '2024-09-04T14:30:00',
      notes: null,
      items: [{ id: 'pri1', description: 'Brand refresh package', quantity: 1, rate: 12000, amount: 12000 }],
      createdAt: '2024-09-01',
      updatedAt: '2024-09-04',
    },
    {
      id: 'pr2',
      clientId: 'c5',
      projectId: null,
      name: 'Brand Identity Package',
      status: 'ACCEPTED',
      total: 7500,
      validityDays: 30,
      viewedAt: null,
      notes: null,
      items: [{ id: 'pri2', description: 'Full brand identity', quantity: 1, rate: 7500, amount: 7500 }],
      createdAt: '2024-08-25',
      updatedAt: '2024-08-30',
    },
  ],
  contracts: [
    {
      id: 'ct1',
      clientId: 'c2',
      projectId: 'p2',
      name: 'Development Agreement',
      status: 'SIGNED',
      value: 45000,
      signedAt: '2024-03-25',
      expiresAt: null,
      notes: null,
      createdAt: '2024-03-20',
      updatedAt: '2024-03-25',
    },
    {
      id: 'ct2',
      clientId: 'c6',
      projectId: 'p4',
      name: 'Annual Service Agreement',
      status: 'SIGNED',
      value: 100000,
      signedAt: '2024-01-15',
      expiresAt: '2025-01-15',
      notes: 'Annual infrastructure retainer',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
    },
  ],
  payments: [
    { id: 'pm1', clientId: 'c1', invoiceId: 'i1', amount: 8500, method: 'BANK_TRANSFER', reference: 'TRF-001', date: '2024-08-05', notes: null, createdAt: '2024-08-05' },
    { id: 'pm2', clientId: 'c2', invoiceId: 'i3', amount: 15000, method: 'BANK_TRANSFER', reference: 'TRF-002', date: '2024-07-01', notes: null, createdAt: '2024-07-01' },
    { id: 'pm3', clientId: 'c2', invoiceId: 'i4', amount: 5000, method: 'CARD', reference: 'CARD-001', date: '2024-08-20', notes: 'Partial payment', createdAt: '2024-08-20' },
    { id: 'pm4', clientId: 'c3', invoiceId: 'i5', amount: 5000, method: 'PAYPAL', reference: 'PP-001', date: '2024-09-01', notes: null, createdAt: '2024-09-01' },
    { id: 'pm5', clientId: 'c6', invoiceId: 'i6', amount: 25000, method: 'BANK_TRANSFER', reference: 'TRF-003', date: '2024-07-01', notes: null, createdAt: '2024-07-01' },
  ],
  activities: [],
  messages: [
    { id: 'm1', clientId: 'c1', content: 'Thanks for the proposal! Reviewing with the team.', isFromClient: true, createdAt: '2024-09-04' },
    { id: 'm2', clientId: 'c2', content: 'Can we discuss the timeline?', isFromClient: true, createdAt: '2024-08-28' },
    { id: 'm3', clientId: 'c3', content: 'Ready for next month\'s tasks!', isFromClient: true, createdAt: '2024-09-02' },
    { id: 'm4', clientId: 'c5', content: 'Excited to start the project!', isFromClient: true, createdAt: '2024-08-30' },
    { id: 'm5', clientId: 'c6', content: 'Please send the quarterly report.', isFromClient: true, createdAt: '2024-09-03' },
  ],
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

interface DataContextValue {
  data: AppData
  isLoaded: boolean
  // Client operations
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  getClient: (id: string) => Client | undefined
  // Project operations
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProjectsByClient: (clientId: string) => Project[]
  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'number'>) => Invoice
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  getInvoicesByClient: (clientId: string) => Invoice[]
  sendInvoice: (id: string) => void
  recordPayment: (invoiceId: string, amount: number, method: Payment['method'], reference?: string) => void
  // Proposal operations
  addProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => Proposal
  updateProposal: (id: string, updates: Partial<Proposal>) => void
  deleteProposal: (id: string) => void
  getProposalsByClient: (clientId: string) => Proposal[]
  sendProposal: (id: string) => void
  // Contract operations
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => Contract
  updateContract: (id: string, updates: Partial<Contract>) => void
  deleteContract: (id: string) => void
  getContractsByClient: (clientId: string) => Contract[]
  // Payment operations
  getPaymentsByClient: (clientId: string) => Payment[]
  getClientRevenue: (clientId: string) => number
  // Activity operations
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void
  getActivitiesByClient: (clientId: string) => Activity[]
  // Message operations
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void
  getMessagesByClient: (clientId: string) => Message[]
  // Dashboard stats
  getDashboardStats: () => {
    totalRevenue: number
    monthlyRevenue: number
    outstanding: number
    activeClients: number
    activeProjects: number
    overdueInvoices: number
    pendingProposals: number
  }
  // Invoice number generation
  generateInvoiceNumber: () => string
}

const DataContext = React.createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<AppData>(() => {
    if (typeof window === 'undefined') return defaultData
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed
      }
    } catch {}
    return seedData
  })
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Mark as loaded after mount
  React.useEffect(() => {
    setIsLoaded(true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  // Save to localStorage on every change
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data, isLoaded])

  // Client operations
  const addClient = React.useCallback((client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client => {
    const now = new Date().toISOString()
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setData(prev => ({ ...prev, clients: [...prev.clients, newClient] }))
    return newClient
  }, [])

  const updateClient = React.useCallback((id: string, updates: Partial<Client>) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }))
  }, [])

  const deleteClient = React.useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id),
      projects: prev.projects.filter(p => p.clientId !== id),
      invoices: prev.invoices.filter(i => i.clientId !== id),
      proposals: prev.proposals.filter(p => p.clientId !== id),
      contracts: prev.contracts.filter(c => c.clientId !== id),
      payments: prev.payments.filter(p => p.clientId !== id),
      messages: prev.messages.filter(m => m.clientId !== id),
      activities: prev.activities.filter(a => a.clientId !== id),
    }))
  }, [])

  const getClient = React.useCallback((id: string) => {
    return data.clients.find(c => c.id === id)
  }, [data.clients])

  // Project operations
  const addProject = React.useCallback((project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const now = new Date().toISOString()
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }))
    return newProject
  }, [])

  const updateProject = React.useCallback((id: string, updates: Partial<Project>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }))
  }, [])

  const deleteProject = React.useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }))
  }, [])

  const getProjectsByClient = React.useCallback((clientId: string) => {
    return data.projects.filter(p => p.clientId === clientId)
  }, [data.projects])

  // Invoice operations
  const generateInvoiceNumber = React.useCallback((): string => {
    const year = new Date().getFullYear()
    const count = data.invoices.filter(i => i.number.startsWith(`INV-${year}`)).length
    return `INV-${year}-${String(count + 1).padStart(3, '0')}`
  }, [data.invoices])

  const addInvoice = React.useCallback((invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'number'>): Invoice => {
    const now = new Date().toISOString()
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId(),
      number: generateInvoiceNumber(),
      createdAt: now,
      updatedAt: now,
    }
    setData(prev => ({ ...prev, invoices: [...prev.invoices, newInvoice] }))
    return newInvoice
  }, [generateInvoiceNumber])

  const updateInvoice = React.useCallback((id: string, updates: Partial<Invoice>) => {
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i =>
        i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
      ),
    }))
  }, [])

  const deleteInvoice = React.useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.filter(i => i.id !== id),
    }))
  }, [])

  const getInvoicesByClient = React.useCallback((clientId: string) => {
    return data.invoices.filter(i => i.clientId === clientId)
  }, [data.invoices])

  const sendInvoice = React.useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i =>
        i.id === id ? { ...i, status: 'SENT', updatedAt: new Date().toISOString() } : i
      ),
    }))
  }, [])

  const recordPayment = React.useCallback((invoiceId: string, amount: number, method: Payment['method'], reference?: string) => {
    const invoice = data.invoices.find(i => i.id === invoiceId)
    if (!invoice) return
    const newPaid = invoice.paid + amount
    const newStatus = newPaid >= invoice.total ? 'PAID' : 'SENT'
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i =>
        i.id === invoiceId ? { ...i, paid: newPaid, status: newStatus, updatedAt: new Date().toISOString() } : i
      ),
      payments: [...prev.payments, {
        id: generateId(),
        clientId: invoice.clientId,
        invoiceId,
        amount,
        method,
        reference: reference || null,
        date: new Date().toISOString(),
        notes: null,
        createdAt: new Date().toISOString(),
      }],
    }))
  }, [data.invoices])

  // Proposal operations
  const addProposal = React.useCallback((proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>): Proposal => {
    const now = new Date().toISOString()
    const newProposal: Proposal = {
      ...proposal,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setData(prev => ({ ...prev, proposals: [...prev.proposals, newProposal] }))
    return newProposal
  }, [])

  const updateProposal = React.useCallback((id: string, updates: Partial<Proposal>) => {
    setData(prev => ({
      ...prev,
      proposals: prev.proposals.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }))
  }, [])

  const deleteProposal = React.useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      proposals: prev.proposals.filter(p => p.id !== id),
    }))
  }, [])

  const getProposalsByClient = React.useCallback((clientId: string) => {
    return data.proposals.filter(p => p.clientId === clientId)
  }, [data.proposals])

  const sendProposal = React.useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      proposals: prev.proposals.map(p =>
        p.id === id ? { ...p, status: 'SENT', updatedAt: new Date().toISOString() } : p
      ),
    }))
  }, [])

  // Contract operations
  const addContract = React.useCallback((contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Contract => {
    const now = new Date().toISOString()
    const newContract: Contract = {
      ...contract,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    setData(prev => ({ ...prev, contracts: [...prev.contracts, newContract] }))
    return newContract
  }, [])

  const updateContract = React.useCallback((id: string, updates: Partial<Contract>) => {
    setData(prev => ({
      ...prev,
      contracts: prev.contracts.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }))
  }, [])

  const deleteContract = React.useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      contracts: prev.contracts.filter(c => c.id !== id),
    }))
  }, [])

  const getContractsByClient = React.useCallback((clientId: string) => {
    return data.contracts.filter(c => c.clientId === clientId)
  }, [data.contracts])

  // Payment operations
  const getPaymentsByClient = React.useCallback((clientId: string) => {
    return data.payments.filter(p => p.clientId === clientId)
  }, [data.payments])

  const getClientRevenue = React.useCallback((clientId: string): number => {
    return data.payments.filter(p => p.clientId === clientId).reduce((sum, p) => sum + p.amount, 0)
  }, [data.payments])

  // Activity operations
  const addActivity = React.useCallback((activity: Omit<Activity, 'id' | 'createdAt'>) => {
    setData(prev => ({
      ...prev,
      activities: [{
        ...activity,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }, ...prev.activities].slice(0, 100), // Keep last 100
    }))
  }, [])

  const getActivitiesByClient = React.useCallback((clientId: string) => {
    return data.activities.filter(a => a.clientId === clientId)
  }, [data.activities])

  // Message operations
  const addMessage = React.useCallback((message: Omit<Message, 'id' | 'createdAt'>) => {
    setData(prev => ({
      ...prev,
      messages: [{
        ...message,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }, ...prev.messages],
    }))
  }, [])

  const getMessagesByClient = React.useCallback((clientId: string) => {
    return data.messages.filter(m => m.clientId === clientId)
  }, [data.messages])

  // Dashboard stats
  const getDashboardStats = React.useCallback(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const totalRevenue = data.payments.reduce((sum, p) => sum + p.amount, 0)
    const monthlyRevenue = data.payments
      .filter(p => new Date(p.date) >= monthStart)
      .reduce((sum, p) => sum + p.amount, 0)
    const outstanding = data.invoices
      .filter(i => i.status !== 'PAID' && i.status !== 'VOID')
      .reduce((sum, i) => sum + (i.total - i.paid), 0)
    const activeClients = data.clients.filter(c => c.status === 'ACTIVE').length
    const activeProjects = data.projects.filter(p => p.status === 'ACTIVE').length
    const overdueInvoices = data.invoices.filter(i => i.status === 'OVERDUE').length
    const pendingProposals = data.proposals.filter(p => p.status === 'SENT' || p.status === 'VIEWED').length

    return { totalRevenue, monthlyRevenue, outstanding, activeClients, activeProjects, overdueInvoices, pendingProposals }
  }, [data])

  const value: DataContextValue = {
    data,
    isLoaded,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByClient,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoicesByClient,
    sendInvoice,
    recordPayment,
    addProposal,
    updateProposal,
    deleteProposal,
    getProposalsByClient,
    sendProposal,
    addContract,
    updateContract,
    deleteContract,
    getContractsByClient,
    getPaymentsByClient,
    getClientRevenue,
    addActivity,
    getActivitiesByClient,
    addMessage,
    getMessagesByClient,
    getDashboardStats,
    generateInvoiceNumber,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const context = React.useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
