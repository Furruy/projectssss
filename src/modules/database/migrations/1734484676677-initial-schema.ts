import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1734484676677 implements MigrationInterface {
  name = 'InitialSchema1734484676677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`access_tokens\` (
        \`id\` varchar(36) NOT NULL,
        \`value\` varchar(255) NOT NULL,
        \`revoked\` tinyint NOT NULL DEFAULT 0,
        \`expired_at\` datetime NOT NULL,
        \`refresh_token_id\` varchar(36) NULL,
        \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` timestamp(0) NULL,
        UNIQUE INDEX \`IDX_951c041e9f8b7f872345aceebc\` (\`value\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE \`refresh_tokens\` (
        \`id\` varchar(36) NOT NULL,
        \`value\` varchar(255) NOT NULL,
        \`revoked\` tinyint NOT NULL DEFAULT 0,
        \`expired_at\` datetime NOT NULL,
        \`user_id\` varchar(36) NULL,
        \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` timestamp(0) NULL,
        UNIQUE INDEX \`IDX_1d2fa515f8af61c943f20aa22c\` (\`value\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`
    );

    // Tạo bảng users
    await queryRunner.query(
      `CREATE TABLE \`users\` (
        \`id\` varchar(36) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`full_name\` varchar(255) NOT NULL,
        \`phone\` varchar(255) NOT NULL,
        \`gender\` int NOT NULL,
        \`address\` varchar(255) NOT NULL,
        \`avatar\` varchar(255) NULL,
        \`status\` int NOT NULL,
        \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` timestamp(0) NULL,
        UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `CREATE TABLE \`roles\` (
        \`id\` INT AUTO_INCREMENT NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`isSuperAdmin\` BOOLEAN DEFAULT false,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`
    );

    // Tạo bảng permissions
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (
        \`id\` INT AUTO_INCREMENT NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`permissions\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    await queryRunner.query(`DROP TABLE \`access_tokens\``);
  }
}
