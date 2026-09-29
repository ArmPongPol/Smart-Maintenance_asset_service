import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790671677936 implements MigrationInterface {
    name = 'Migration1790671677936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."maintenance_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`);
        await queryRunner.query(`CREATE TYPE "public"."maintenance_status_enum" AS ENUM('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "maintenance_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "request_no" character varying(50) NOT NULL, "machine_id" uuid NOT NULL, "created_by" uuid NOT NULL, "current_technician_id" uuid, "title" character varying(255) NOT NULL, "description" text NOT NULL, "priority" "public"."maintenance_priority_enum" NOT NULL DEFAULT 'MEDIUM', "status" "public"."maintenance_status_enum" NOT NULL DEFAULT 'OPEN', "image_url" character varying(500), "completed_at" TIMESTAMP WITH TIME ZONE, "closed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e5cdfe45085b1fa8a48c2ea3f0f" UNIQUE ("request_no"), CONSTRAINT "PK_c1521eb67c471accae8c531f9fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b9ed7346f79119e4212ad151f" ON "maintenance_requests"  ("machine_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_86cbb991b3ec2f73894ffdffa6" ON "maintenance_requests"  ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d6defaa334b1eb8c44f5b6d50" ON "maintenance_requests"  ("current_technician_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a25fdc08fed6c0c68a1ebc3f5" ON "maintenance_requests"  ("priority") `);
        await queryRunner.query(`CREATE INDEX "IDX_0330e7473e867931548e20dc4a" ON "maintenance_requests"  ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_12aa654c705d93d0b5c5c69ec4" ON "maintenance_requests"  ("created_at") `);
        await queryRunner.query(`CREATE TABLE "maintenance_assignments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "maintenance_request_id" uuid NOT NULL, "technician_id" uuid NOT NULL, "assigned_by" uuid NOT NULL, "assigned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d0647c6507c0e2e6feb7f03a49f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8671dcf84e8547cf7afcfa91aa" ON "maintenance_assignments"  ("maintenance_request_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a204e53c84ffccfa2dc06a8e19" ON "maintenance_assignments"  ("technician_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b2a9bd71f8bd81411ae925eda" ON "maintenance_assignments"  ("assigned_at") `);
        await queryRunner.query(`CREATE TABLE "maintenance_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "maintenance_request_id" uuid NOT NULL, "user_id" uuid NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_7f982ba003e023fa790b3771a9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5c51ac0cb006299f977a3fa9f9" ON "maintenance_comments"  ("maintenance_request_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6d607ee6d4fd69e0a41a5698b" ON "maintenance_comments"  ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_22c9736254058129a860dd7eb8" ON "maintenance_comments"  ("created_at") `);
        await queryRunner.query(`CREATE TABLE "maintenance_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "maintenance_request_id" uuid NOT NULL, "changed_by" uuid NOT NULL, "old_status" "public"."maintenance_status_enum", "new_status" "public"."maintenance_status_enum" NOT NULL, "note" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_026a5e1504339e445bb8bd8b855" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c2b3bc2781e2f69387c81af12b" ON "maintenance_histories"  ("maintenance_request_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_367b261601f174a6903b2efcf3" ON "maintenance_histories"  ("created_at") `);
        await queryRunner.query(`ALTER TABLE "maintenance_assignments" ADD CONSTRAINT "FK_8671dcf84e8547cf7afcfa91aae" FOREIGN KEY ("maintenance_request_id") REFERENCES "maintenance_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "maintenance_comments" ADD CONSTRAINT "FK_5c51ac0cb006299f977a3fa9f99" FOREIGN KEY ("maintenance_request_id") REFERENCES "maintenance_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "maintenance_histories" ADD CONSTRAINT "FK_c2b3bc2781e2f69387c81af12bb" FOREIGN KEY ("maintenance_request_id") REFERENCES "maintenance_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "maintenance_histories" DROP CONSTRAINT "FK_c2b3bc2781e2f69387c81af12bb"`);
        await queryRunner.query(`ALTER TABLE "maintenance_comments" DROP CONSTRAINT "FK_5c51ac0cb006299f977a3fa9f99"`);
        await queryRunner.query(`ALTER TABLE "maintenance_assignments" DROP CONSTRAINT "FK_8671dcf84e8547cf7afcfa91aae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_367b261601f174a6903b2efcf3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2b3bc2781e2f69387c81af12b"`);
        await queryRunner.query(`DROP TABLE "maintenance_histories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22c9736254058129a860dd7eb8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6d607ee6d4fd69e0a41a5698b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c51ac0cb006299f977a3fa9f9"`);
        await queryRunner.query(`DROP TABLE "maintenance_comments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b2a9bd71f8bd81411ae925eda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a204e53c84ffccfa2dc06a8e19"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8671dcf84e8547cf7afcfa91aa"`);
        await queryRunner.query(`DROP TABLE "maintenance_assignments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12aa654c705d93d0b5c5c69ec4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0330e7473e867931548e20dc4a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a25fdc08fed6c0c68a1ebc3f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d6defaa334b1eb8c44f5b6d50"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86cbb991b3ec2f73894ffdffa6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b9ed7346f79119e4212ad151f"`);
        await queryRunner.query(`DROP TABLE "maintenance_requests"`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."maintenance_priority_enum"`);
    }

}
