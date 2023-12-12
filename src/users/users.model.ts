import { Column, Default, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  surname: string;

  @Column
  hireDate: Date;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  role: string;
}
