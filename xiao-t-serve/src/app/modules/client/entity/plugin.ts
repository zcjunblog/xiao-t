import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
import { Column } from 'typeorm';

/**
 * 插件
 */
@EntityModel('client_plugin')
export class ClientPluginEntity extends BaseEntity {
  @Column({ comment: '插件名称', default: null })
  name: string;

  @Column({ comment: '插件描述', default: null })
  desc: string;

  @Column({ comment: '图标链接', default: null })
  icon: string;

  @Column({ comment: '下载地址', default: null })
  downloadUrl: string;

  @Column({ comment: '配置文件', default: null })
  pluginJson: string;
}
