import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  MAINTENANCE_STATUS_ENUM,
  MaintenanceStatus,
} from '../maintenance.enums.js';
import { MaintenanceRequest } from './maintenance-request.entity.js';

// Append-only, so there is no updated_at and it does not extend BaseEntity.
@Entity('maintenance_histories')
export class MaintenanceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'maintenance_request_id', type: 'uuid' })
  maintenanceRequestId: string;

  @ManyToOne(() => MaintenanceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'maintenance_request_id' })
  maintenanceRequest?: MaintenanceRequest;

  // auth-service user
  @Column({ name: 'changed_by', type: 'uuid' })
  changedBy: string;

  // null for the first entry, when the request is created.
  @Column({
    name: 'old_status',
    type: 'enum',
    enum: MaintenanceStatus,
    enumName: MAINTENANCE_STATUS_ENUM,
    nullable: true,
  })
  oldStatus: MaintenanceStatus | null;

  @Column({
    name: 'new_status',
    type: 'enum',
    enum: MaintenanceStatus,
    enumName: MAINTENANCE_STATUS_ENUM,
  })
  newStatus: MaintenanceStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Index()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
