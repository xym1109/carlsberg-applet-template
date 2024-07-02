import * as main from './api/main';
import * as user from './api/user';

const service = {
  ...main,
  ...user
};

export default service;
