import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
import { Column } from 'typeorm';

/**
 * 商品
 */
@EntityModel('client_cli_template')
export class ClientCliEntity extends BaseEntity {
  @Column({ comment: '项目名称', default: null })
  name: string;

  @Column({ comment: '项目描述', default: null })
  desc: string;

  @Column({ comment: '适用平台', default: null })
  type: string;

  @Column({ comment: '克隆地址', default: null })
  git: string;

  @Column({ comment: '仓库地址', default: null })
  url: string;

  @Column({ comment: '仓库作者', default: null })
  userName: string;

  @Column({ comment: '仓库名称', default: null })
  repo: string;

  @Column({ comment: '分支作者', default: null })
  branch: string;

  @Column({ comment: '托管平台', default: null })
  host: string;
}
