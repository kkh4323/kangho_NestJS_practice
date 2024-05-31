import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { Provider } from './provider.enum';
import { AgreeOfTerm } from '../../agree-of-term/entities/agree-of-term.entity';
import { UserInfo } from '../../user-info/entities/user-info.entity';
import { Role } from './role.enum';

@Entity()
export class User extends BaseEntity {
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column({
    nullable: true,
  })
  public password?: string;

  @Column({
    nullable: true,
  })
  public phone?: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  public provider: Provider;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  public roles: Role[];

  @Column({ nullable: true })
  public profileImg?: string;

  @OneToOne(() => AgreeOfTerm, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public agreeOfTerm: AgreeOfTerm;

  @OneToOne(() => UserInfo, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public userInfo: UserInfo;

  @BeforeInsert()
  async beforeSaveFunction() {
    if (this.provider !== Provider.LOCAL) {
      return;
    } else {
      // password 암호화
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
      // 프로필 이미지 자동생성
      this.profileImg = gravatar.url(this.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
        protocol: 'https',
      });
    }
  }
}
