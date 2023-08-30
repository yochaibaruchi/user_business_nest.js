import { Business } from 'src/business/entities/business.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';

export enum InvoiceType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}
//add index on date and add insertDate.
@Index('invoice_number', ['invoiceNumber'])
@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: InvoiceType,
  })
  invoiceType: InvoiceType;

  @ManyToOne(() => Business, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({
    referencedColumnName: 'businessId',
    name: 'businessId',
    foreignKeyConstraintName: 'business_invoice',
  })
  business: Business;

  @Column({ name: 'invoice_number' })
  invoiceNumber: string;

  @Column({ name: 'client_name' })
  clientName: String;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  sum: number;

  @Column({ name: 'currency' })
  currency: string;

  @Column({
    name: 'issue_date',
  })
  issueDate: Date;

  @Column({
    name: 'email_adress',
    nullable: true,
  })
  email: string;

  @Column({
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber: string;

  @Column({ name: 'item' })
  item: string;

  @Column({ name: 'image_path', nullable: true })
  imagePath: string;
}
