import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, length: 64, type: 'varchar' })
  username: string;

  @Column({ nullable: false, type: 'text' })
  publicKey: string;
}
