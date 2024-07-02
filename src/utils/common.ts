import type {
  ProvinceTargetType,
  ProvinceInitType,
  IdMappingType,
  CityType,
  DistrictType
} from '@/types/mall';

// 省市区格式转化
export const cityFormat = (data: ProvinceInitType[]) => {
  const obj: ProvinceTargetType = {
    province_list: {},
    city_list: {},
    county_list: {}
  };
  const IdsMapping: IdMappingType = {};

  data.forEach((provin: ProvinceInitType) => {
    obj.province_list[Number(provin.provinceCode)] = provin.provinceName;
    provin.cityDTOS &&
      provin.cityDTOS.forEach((city: CityType) => {
        obj.city_list[Number(city.cityCode)] = city.cityName;
        city.districtDTOS &&
          city.districtDTOS.forEach((district: DistrictType) => {
            obj.county_list[Number(district.districtCode)] = district.district;
            IdsMapping[district.districtCode] = district.id;
          });
      });
  });

  return {
    list: obj,
    IdsMapping
  };
};

// 获取日期
export function dateFormatYYYYMMDD(dateVal: Date | string | number) {
  let date = new Date(dateVal);
  let year = date.getFullYear();
  let month: number | string = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  let day: number | string = date.getDate();
  day = day < 10 ? '0' + day : day;
  return `${year}-${month}-${day}`;
}

// 去掉日期中的 T
export const formatTime = (time: string) => time.split('T')[0].replace(/-/g, '.');
