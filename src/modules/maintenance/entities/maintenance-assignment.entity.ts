import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MaintenanceRequest } from './maintenance-request.entity.js';

// No created_at / updated_at in the ER, so this does not extend BaseEntity.
@Entity('maintenance_assignments')
export class MaintenanceAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'maintenance_request_id', type: 'uuid' })
  maintenanceRequestId: string;

  @ManyToOne(() => MaintenanceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'maintenance_request_id' })
  maintenanceRequest?: MaintenanceRequest;

  // auth-service user
  @Index()
  @Column({ name: 'technician_id', type: 'uuid' })
  technicianId: string;

  // auth-service user
  @Column({ name: 'assigned_by', type: 'uuid' })
  assignedBy: string;

  @Index()
  @CreateDateColumn({ name: 'assigned_at', type: 'timestamptz' })
  assignedAt: Date;
}
