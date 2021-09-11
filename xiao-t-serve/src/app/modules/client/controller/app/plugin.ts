import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { ClientPluginEntity } from '../../entity/plugin';

/**
 * 商品
 */
@Provide()
@CoolController({
  api: ['info', 'list', 'page'],
  entity: ClientPluginEntity,
})
export class ClientPluginAppController extends BaseController {
  /**
   * 其他接口
   */
}
