import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import {
  MAINTENANCE_PRIORITY_ENUM,
  MAINTENANCE_STATUS_ENUM,
  MaintenancePriority,
  MaintenanceStatus,
} from '../maintenance.enums.js';

@Entity('maintenance_requests')
@Index(['createdAt'])
export class MaintenanceRequest extends BaseEntity {
  // The unique constraint also indexes it.
  @Column({ name: 'request_no', type: 'varchar', length: 50, unique: true })
  requestNo: string;

  // asset-service machine
  @Index()
  @Column({ name: 'machine_id', type: 'uuid' })
  machineId: string;

  // auth-service user
  @Index()
  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  // auth-service user
  @Index()
  @Column({ name: 'current_technician_id', type: 'uuid', nullable: true })
  currentTechnicianId: string | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Index()
  @Column({
    type: 'enum',
    enum: MaintenancePriority,
    enumName: MAINTENANCE_PRIORITY_ENUM,
    default: MaintenancePriority.MEDIUM,
  })
  priority: MaintenancePriority;

  @Index()
  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    enumName: MAINTENANCE_STATUS_ENUM,
    default: MaintenanceStatus.OPEN,
  })
  status: MaintenanceStatus;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date | null;
}
