export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum MaintenanceStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

// Postgres enum type names, shared by every column that uses them.
export const MAINTENANCE_PRIORITY_ENUM = 'maintenance_priority_enum';
export const MAINTENANCE_STATUS_ENUM = 'maintenance_status_enum';
