import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class AgreeOfTerm {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user: User) => user.agreeOfTerm)
  public user?: User;

  @Column({ default: false })
  public overTwenty: boolean;

  @Column({ default: false })
  public useTerm: boolean;

  @Column({ default: false })
  public personalInfo: boolean;

  @Column({ default: false })
  public marketingAgree: boolean;

  @Column({ default: false })
  public etc: boolean;
}
