import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Benefit extends Model {
  @Column
  benefit_name: string;

  @Column
  benefit_type: string;

  @Column
  benefit_category: string;

  @Column
  benefit_description: string;

  @Column({ defaultValue: 0 })
  price: number;

  @Column
  vendor_code: string;

  @Column
  benefit_image: string;

  @Column({ defaultValue: 0 })
  in_stock: boolean;

  @Column({ defaultValue: 0 })
  bestseller: boolean;

  @Column({ defaultValue: 0 })
  new: boolean;

  @Column
  popularity: number;

  @Column
  info: string;
}
