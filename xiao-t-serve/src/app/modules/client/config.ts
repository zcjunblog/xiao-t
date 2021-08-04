import { Application } from 'egg';
import { ModuleConfig } from 'midwayjs-cool-core';

/**
 * 模块配置
 */
export default (app: Application) => {
  return {
    // 模块名称
    name: '客户端',
    // 模块描述
    description: '客户端模块，整个xiao-t客户端直接调用的接口模块',
    // 中间件
    middlewares: [],
  } as ModuleConfig;
};
