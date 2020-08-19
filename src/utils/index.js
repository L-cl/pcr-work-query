/**
 * 格式化代码
 */
export const formatNumber = (value, opt) => {
  if (isUnDef(value) || value === '') {
    return value;
  }
  const { returnObj } = opt;
  let unit = '';
  let v = value;
  if ((v = value / 100000000) > 1) {
    unit = '亿';
  } else if ((v = value / 10000) > 1) {
    unit = '万';
  } else {
    v = value;
  }
  v = ~~(v * 100) / 100;
  if (returnObj) {
    return {
      v,
      unit,
    };
  } else {
    return `${v}${unit}`;
  }
};

export const isDef = (v) => {
  return v !== undefined && v !== null;
};

export const isUnDef = (v) => {
  return v === undefined || v === null;
};
