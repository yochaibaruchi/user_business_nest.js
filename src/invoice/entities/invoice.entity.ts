import { Business } from 'src/business/entities/business.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({
    referencedColumnName: 'businessId',
    name: 'businessId',
    foreignKeyConstraintName: 'business_invoice',
  })
  business: Business;

  @Column({
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(data, '$.invoiceNumber'))",
  })
  invoiceNumber: string;

  @Column({
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(data, '$.amount'))",
  })
  amount: string;

  @Column({
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(data, '$.invoiceDate'))",
  })
  invoiceDate: Date;

  @Column({
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(data, '$.dueDate'))",
  })
  dueDate: Date;

  @Column('json')
  data: object;
}
