import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Blog extends BaseEntity {
  // @PrimaryGeneratedColumn('uuid')
  // public id: string;

  @Column()
  public title: string;

  @Column()
  public desc: string;

  @Column()
  public price: number;

  @Column()
  public category: string;
}
