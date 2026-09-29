import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { MaintenanceRequest } from './maintenance-request.entity.js';

@Entity('maintenance_comments')
@Index(['createdAt'])
export class MaintenanceComment extends BaseEntity {
  @Index()
  @Column({ name: 'maintenance_request_id', type: 'uuid' })
  maintenanceRequestId: string;

  @ManyToOne(() => MaintenanceRequest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'maintenance_request_id' })
  maintenanceRequest?: MaintenanceRequest;

  // auth-service user
  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  message: string;
}
