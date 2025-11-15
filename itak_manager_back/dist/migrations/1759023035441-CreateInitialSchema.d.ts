import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateInitialSchema1759023035441 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
