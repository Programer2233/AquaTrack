// Simple JSON-file data store for the hackathon demo
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json');

export interface Area {
  id: string;
  name: string;
  region: string;
}

export interface WaterUsageRecord {
  id: string;
  areaId: string;
  areaName: string;
  households: number;
  volumeUsed: number;
  month: string;
  year: number;
  createdAt: string;
  createdBy: string;
}

export interface Plumber {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  services: string;
  areas: string;
  experience: number;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface LeakReport {
  id: string;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reporterName: string;
  reporterPhone: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

interface DataStore {
  admins: { username: string; password: string; name: string }[];
  areas: Area[];
  records: WaterUsageRecord[];
  plumbers: Plumber[];
  leakReports: LeakReport[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

const SEED_DATA: DataStore = {
  admins: [
    { username: 'admin', password: 'aquatrack2026', name: 'Municipal Admin' },
  ],
  areas: [
    { id: 'area1', name: 'Woreda 01', region: 'Bole' },
    { id: 'area2', name: 'Woreda 02', region: 'Kirkos' },
    { id: 'area3', name: 'Woreda 03', region: 'Arada' },
    { id: 'area4', name: 'Woreda 04', region: 'Yeka' },
    { id: 'area5', name: 'Woreda 05', region: 'Lideta' },
    { id: 'area6', name: 'Woreda 06', region: 'Gullele' },
  ],
  records: [
    { id: 'r1', areaId: 'area1', areaName: 'Woreda 01', households: 1250, volumeUsed: 45000, month: 'January', year: 2026, createdAt: '2026-02-01', createdBy: 'admin' },
    { id: 'r2', areaId: 'area1', areaName: 'Woreda 01', households: 1250, volumeUsed: 42000, month: 'February', year: 2026, createdAt: '2026-03-01', createdBy: 'admin' },
    { id: 'r3', areaId: 'area1', areaName: 'Woreda 01', households: 1260, volumeUsed: 39500, month: 'March', year: 2026, createdAt: '2026-04-01', createdBy: 'admin' },
    { id: 'r4', areaId: 'area2', areaName: 'Woreda 02', households: 800, volumeUsed: 32000, month: 'January', year: 2026, createdAt: '2026-02-01', createdBy: 'admin' },
    { id: 'r5', areaId: 'area2', areaName: 'Woreda 02', households: 810, volumeUsed: 30500, month: 'February', year: 2026, createdAt: '2026-03-01', createdBy: 'admin' },
    { id: 'r6', areaId: 'area2', areaName: 'Woreda 02', households: 815, volumeUsed: 28000, month: 'March', year: 2026, createdAt: '2026-04-01', createdBy: 'admin' },
    { id: 'r7', areaId: 'area3', areaName: 'Woreda 03', households: 2100, volumeUsed: 78000, month: 'January', year: 2026, createdAt: '2026-02-01', createdBy: 'admin' },
    { id: 'r8', areaId: 'area3', areaName: 'Woreda 03', households: 2100, volumeUsed: 75000, month: 'February', year: 2026, createdAt: '2026-03-01', createdBy: 'admin' },
    { id: 'r9', areaId: 'area3', areaName: 'Woreda 03', households: 2120, volumeUsed: 72000, month: 'March', year: 2026, createdAt: '2026-04-01', createdBy: 'admin' },
    { id: 'r10', areaId: 'area4', areaName: 'Woreda 04', households: 450, volumeUsed: 95000, month: 'January', year: 2026, createdAt: '2026-02-01', createdBy: 'admin' },
    { id: 'r11', areaId: 'area4', areaName: 'Woreda 04', households: 450, volumeUsed: 92000, month: 'February', year: 2026, createdAt: '2026-03-01', createdBy: 'admin' },
    { id: 'r12', areaId: 'area4', areaName: 'Woreda 04', households: 455, volumeUsed: 89000, month: 'March', year: 2026, createdAt: '2026-04-01', createdBy: 'admin' },
    { id: 'r13', areaId: 'area5', areaName: 'Woreda 05', households: 1600, volumeUsed: 58000, month: 'January', year: 2026, createdAt: '2026-02-01', createdBy: 'admin' },
    { id: 'r14', areaId: 'area5', areaName: 'Woreda 05', households: 1600, volumeUsed: 55000, month: 'February', year: 2026, createdAt: '2026-03-01', createdBy: 'admin' },
    { id: 'r15', areaId: 'area5', areaName: 'Woreda 05', households: 1610, volumeUsed: 52000, month: 'March', year: 2026, createdAt: '2026-04-01', createdBy: 'admin' },
    { id: 'r16', areaId: 'area6', areaName: 'Woreda 06', households: 950, volumeUsed: 36000, month: 'January', year: 2026, createdAt: '2026-02-01', createdBy: 'admin' },
    { id: 'r17', areaId: 'area6', areaName: 'Woreda 06', households: 955, volumeUsed: 34000, month: 'February', year: 2026, createdAt: '2026-03-01', createdBy: 'admin' },
    { id: 'r18', areaId: 'area6', areaName: 'Woreda 06', households: 960, volumeUsed: 31000, month: 'March', year: 2026, createdAt: '2026-04-01', createdBy: 'admin' },
  ],
  plumbers: [
    { id: 'p1', name: 'Abel Tesfaye', email: 'abel@ethiofix.com', phone: '+251 911 123 456', license: 'PLB-ETH-2024-01', services: 'Pipe Repair, Leak Detection', areas: 'Bole, Kirkos', experience: 7, bio: 'Expert in residential plumbing in Addis Ababa.', status: 'approved', createdAt: '2026-01-15' },
    { id: 'p2', name: 'Bethlehem Girma', email: 'betty@plumb Addis.com', phone: '+251 922 234 567', license: 'PLB-ETH-2024-02', services: 'Water Heater, Emergency Repairs', areas: 'Arada, Yeka', experience: 10, bio: 'Professional plumber specializing in water efficiency.', status: 'approved', createdAt: '2026-01-20' },
    { id: 'p3', name: 'Dawit Mekonnen', email: 'dawit@quickfix.com', phone: '+251 933 345 678', license: 'PLB-ETH-2025-03', services: 'Drain Cleaning, Pipe Installation', areas: 'Lideta, Gullele', experience: 5, bio: 'Dedicated to providing fast and reliable plumbing services.', status: 'approved', createdAt: '2026-02-10' },
    { id: 'p4', name: 'Tigist Assefa', email: 'tigist@leakexpert.com', phone: '+251 944 456 789', license: 'PLB-ETH-2025-04', services: 'Leak Detection, Meter Installation', areas: 'Bole, Arada', experience: 4, bio: 'Passionate about water conservation and modern plumbing.', status: 'pending', createdAt: '2026-03-05' },
  ],
  leakReports: [
    { id: 'l1', location: 'Bole Road, Near Friendship Mall', description: 'Large pipe burst flooding the sidewalk', severity: 'critical', reporterName: 'Kebede M.', reporterPhone: '+251 900 111 222', status: 'in-progress', createdAt: '2026-04-18' },
    { id: 'l2', location: 'Piassa, Church Square', description: 'Public fountain leaking excessively', severity: 'medium', reporterName: 'Aster W.', reporterPhone: '+251 900 333 444', status: 'open', createdAt: '2026-04-20' },
  ],
};

function ensureDataFile(): DataStore {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_DATA, null, 2));
    return SEED_DATA;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveData(data: DataStore) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ---- Auth ----
export function validateAdmin(username: string, password: string) {
  const data = ensureDataFile();
  return data.admins.find(a => a.username === username && a.password === password);
}

// ---- Areas ----
export function getAreas(): Area[] {
  return ensureDataFile().areas;
}

export function addArea(name: string, region: string): Area {
  const data = ensureDataFile();
  const area: Area = { id: generateId(), name, region };
  data.areas.push(area);
  saveData(data);
  return area;
}

// ---- Water Usage Records ----
export function getRecords(): WaterUsageRecord[] {
  return ensureDataFile().records;
}

export function addRecord(record: Omit<WaterUsageRecord, 'id' | 'createdAt'>): WaterUsageRecord {
  const data = ensureDataFile();
  const newRecord: WaterUsageRecord = {
    ...record,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  data.records.push(newRecord);
  saveData(data);
  return newRecord;
}

export function updateRecord(id: string, record: Partial<WaterUsageRecord>): WaterUsageRecord | null {
  const data = ensureDataFile();
  const index = data.records.findIndex(r => r.id === id);
  if (index === -1) return null;
  data.records[index] = { ...data.records[index], ...record };
  saveData(data);
  return data.records[index];
}

export function deleteRecord(id: string): boolean {
  const data = ensureDataFile();
  const initialLength = data.records.length;
  data.records = data.records.filter(r => r.id !== id);
  if (data.records.length === initialLength) return false;
  saveData(data);
  return true;
}

// ---- Plumbers ----
export function getPlumbers(status?: string): Plumber[] {
  const data = ensureDataFile();
  if (status) return data.plumbers.filter(p => p.status === status);
  return data.plumbers;
}

export function addPlumber(plumber: Omit<Plumber, 'id' | 'status' | 'createdAt'>): Plumber {
  const data = ensureDataFile();
  const newPlumber: Plumber = {
    ...plumber,
    id: generateId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  data.plumbers.push(newPlumber);
  saveData(data);
  return newPlumber;
}

export function updatePlumberStatus(id: string, status: 'approved' | 'rejected'): Plumber | null {
  const data = ensureDataFile();
  const plumber = data.plumbers.find(p => p.id === id);
  if (!plumber) return null;
  plumber.status = status;
  saveData(data);
  return plumber;
}

// ---- Leak Reports ----
export function getLeakReports(): LeakReport[] {
  return ensureDataFile().leakReports;
}

export function addLeakReport(report: Omit<LeakReport, 'id' | 'status' | 'createdAt'>): LeakReport {
  const data = ensureDataFile();
  const newReport: LeakReport = {
    ...report,
    id: generateId(),
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  data.leakReports.push(newReport);
  saveData(data);
  return newReport;
}

export function updateLeakReportStatus(id: string, status: 'open' | 'in-progress' | 'resolved'): LeakReport | null {
  const data = ensureDataFile();
  const report = data.leakReports.find(r => r.id === id);
  if (!report) return null;
  report.status = status;
  saveData(data);
  return report;
}
