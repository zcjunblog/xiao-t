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
})
export class ClientCliAdminController extends BaseController {
  /**
   * 其他接口
   */
}
