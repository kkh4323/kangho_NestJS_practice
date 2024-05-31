import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user: User) => user.userInfo)
  public user: User;

  @Column()
  public birthday: number;

  @Column()
  public age: number;

  @Column()
  public graduated: string;

  @BeforeInsert()
  async beforeSaveFunction() {
    const numStr = this.birthday.toString();

    const year = parseInt(numStr.substring(0, 4));
    const month = parseInt(numStr.substring(4, 6)) - 1;
    const day = parseInt(numStr.substring(6, 8));

    const birthdayDate = new Date(year, month, day);
    const today = new Date();

    const age = today.getFullYear() - birthdayDate.getFullYear() + 1;

    this.age = age;
  }
}
