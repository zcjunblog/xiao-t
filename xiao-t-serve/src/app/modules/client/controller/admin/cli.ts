import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { ClientCliEntity } from '../../entity/cli';

/**
 * 商品
 */
@Provide()
@CoolController({
  api: ['info', 'list', 'page', 'add', 'delete', 'update'],
  entity: ClientCliEntity,
  // 分页查询配置
  pageQueryOp: {
    // 让name字段支持模糊查询
    keyWordLikeFields: ['name'],
    // 让type字段支持筛选
    fieldEq: ['type'],
  },
})
export class ClientCliAdminController extends BaseController {
  /**
   * 其他接口
   */
}
