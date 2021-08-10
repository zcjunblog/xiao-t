import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
import { Column } from 'typeorm';

/**
 * 商品
 */
@EntityModel('client_cli_template')
export class ClientCliEntity extends BaseEntity {
  @Column({ comment: '插件名称', default: null })
  name: string;

  @Column({ comment: '插件描述', default: null })
  desc: string;

  @Column({ comment: '图标', default: null })
  type: string;
}
