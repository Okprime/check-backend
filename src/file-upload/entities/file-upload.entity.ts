// import { User } from 'src/user/entities/user.entity';
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('file-upload')
// export class FileUpload {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', length: 300, nullable: false })
//   fileName: string;

//   @Column({ type: 'varchar', length: 300, nullable: false })
//   fileURL: string;

//   // @ManyToOne(() => User, (user) => user.myUploads, {})
//   // @JoinColumn({ name: 'user_id' })
//   // user: User;

//   @Column({ type: 'boolean', nullable: true, default: false })
//   isDeleted?: boolean;

//   @Column({ type: 'boolean', nullable: true, default: false })
//   isUnsafe?: boolean;

//   @Column()
//   @CreateDateColumn()
//   createdAt: Date;

//   @Column()
//   @UpdateDateColumn()
//   updatedAt: Date;
// }
