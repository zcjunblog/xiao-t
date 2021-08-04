import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, Cache, CoolTransaction } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { ClientCliEntity } from '../entity/cli';

@Provide()
export class ClientCliService extends BaseService {
  @InjectEntityModel(ClientCliEntity)
  ClientCliEntity: Repository<ClientCliEntity>;
}
