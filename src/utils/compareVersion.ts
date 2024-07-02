// 版本比较，如果v1 > v2，则返回值大于0
function compareVersion(v1: string, v2: string) {
  let arr1: string[];
  let arr2: string[];
  arr1 = v1.split('.');
  arr2 = v2.split('.');
  const len = Math.max(arr1.length, arr2.length);

  while (arr1.length < len) {
    arr1.push('0');
  }
  while (arr2.length < len) {
    arr2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(arr1[i]);
    const num2 = parseInt(arr2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

export default compareVersion;
