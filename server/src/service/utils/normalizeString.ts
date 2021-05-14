export const increment_alphanumeric_str = str => {
  const count = str.match(/\d*$/);
  return `${str.substr(0, count.index)}${++count[0]}`;
};
export const decrement_alphanumeric_str = str => {
  const count = str.match(/\d*$/);
  return `${str.substr(0, count.index)}${count[0] - 1 <= 0 ? '' : count[0] - 1}`;
};
export const test = str => {
  const count = str.match(/\d*$/);
  return count;
};
export const getLoginNameFromName = (name) => {
  const normalName = name.trim()
        .normalize('NFD')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
  const splitName = normalName.split(" ")
  let suffix = ""
  for (let index = 0; index < splitName.length - 1; index++) {
    suffix += splitName[index][0]
  }
  return `${splitName[splitName.length -1]}${suffix}`
}
export const checkCodeContext = (entity, foundedEntity) => {
  if (foundedEntity.length > 0) {
    const reg = new RegExp(entity.code + '\\d*$');
    const founded = [];
    foundedEntity.forEach(item => {
      if (reg.test(item.code)) {
        founded.push(item.code);
      }
    });
    if (founded.length > 0) {
      const res = increment_alphanumeric_str(founded[founded.length - 1]);
      entity.code = res;
    }
  }
  return entity;
};
