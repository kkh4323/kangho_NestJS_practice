import { BeforeInsert, Column, Entity, OneToOne } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { BaseEntity } from '@common/base.entity';
import { Gender } from '@user-info/entities/gender.enum';
import { BloodType } from '@user-info/entities/bloodType.enum';
import { Drinking } from '@user-info/entities/drinking.enum';
import { BodyType } from '@user-info/entities/bodyType.enum';

@Entity()
export class UserInfo extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.userInfo)
  public user: User;

  @Column()
  public country: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Man,
  })
  public gender: Gender;

  @Column()
  public birth: string;

  @Column()
  public age: number;

  @Column()
  public height: number;

  @Column({
    type: 'enum',
    enum: BloodType,
    default: BloodType.A,
  })
  public bloodType: BloodType;

  @Column()
  public mbtiType: string;

  @Column()
  public addressOfHome: string;

  @Column()
  public activityArea: string;

  @Column()
  public bornArea: string;

  @Column({
    type: 'enum',
    enum: BodyType,
    default: BodyType.Regular,
  })
  public bodyType: BodyType;

  @Column({
    type: 'enum',
    enum: Drinking,
    default: Drinking.NotDrinkingAtAll,
  })
  public drinking: Drinking;

  @Column({ default: false })
  public smoking: boolean;

  @Column()
  public selfIntroduce: string;

  @Column()
  public graduated: string;

  @BeforeInsert()
  async beforeSaveFunction() {
    const numStr = this.birth.toString();

    const year = parseInt(numStr.substring(0, 4));
    const month = parseInt(numStr.substring(4, 6)) - 1;
    const day = parseInt(numStr.substring(6, 8));

    const birthdayDate = new Date(year, month, day);
    const today = new Date();

    const age = today.getFullYear() - birthdayDate.getFullYear() + 1;

    this.age = age;
  }
}
