/* if (typeof res === 'object' && res !== null && 'data' in res) {
  const apiRes: ApiResponse = res as ApiResponse;
  // 对 apiRes 进行类型检查，确保它符合 ApiResponse 类型
  console.log(apiRes.data);
} */
export type GenericArray<T> = Array<T>;

export interface ApiResponse {
  code: number;
  data?: any;
  msg: string;
}
export interface ObjType {
  [key: string]: any;
}

export interface UserInfo extends ObjType {
  nickname?: string;
  mobile?: number | string;
}

// 订阅消息方法的参数类型
export interface SubscribeParamsType extends ObjType {
  ids: string[];
  success?: Function;
  fail?: Function;
  cb?: Function;
}

// 品牌活动
export interface BannerOptionType extends ObjType {
  appid?: string;
  href?: string;
  code?: string;
  id: number;
  img: string;
  jumptype: number;
  name: string;
}

// 券合集列表
export interface AllCoupons {
  groupId: number;
  groupName: string;
  couponDTOS: CouponsOptionType[];
}
export interface CouponsOptionType extends ObjType {
  img: string;
  name: string;
  couponGroup?: number;
  couponSecondType: number;
  couponContent?: string;
  couponStatus: string;
  prizeCode: string;
  prizeId: number;
  description: string;
  appid?: string;
  path?: string;
  logos?: string[];
}

export interface CouponDialogOption {
  title: string;
  content1?: string;
  content2?: string;
  contentpwd?: string;
  btnText: string;
  tap: string;
  type: string;
  appid?: string;
  path?: string;
}
