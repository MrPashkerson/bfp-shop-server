import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class ShoppingCart extends Model {
  @Column
  userId: number;

  @Column({ defaultValue: 0 })
  benefitId: number;

  @Column
  benefit_name: string;

  @Column
  benefit_type: string;

  @Column
  benefit_category: string;

  @Column({ defaultValue: 0 })
  price: number;

  @Column
  image: string;

  @Column({ defaultValue: false })
  in_stock: number;

  @Column({ defaultValue: 1 })
  count: number;

  @Column({ defaultValue: 0 })
  total_price: number;
}
