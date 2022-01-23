import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { ClientPluginEntity } from '../../entity/plugin';

/**
 * 插件
 */
@Provide()
@CoolController({
  api: ['info', 'list', 'page', 'add', 'delete', 'update'],
  entity: ClientPluginEntity,
  // 分页查询配置
  pageQueryOp: {
    // 让name字段支持模糊查询
    keyWordLikeFields: ['name'],
    // 让type字段支持筛选
    fieldEq: ['type'],
  },
})
export class ClientPluginAdminController extends BaseController {
  /**
   * 其他接口
   */
}
