export const increment_alphanumeric_str = str => {
  const numeric = str.match(/\d+$/) ? str.match(/\d+$/)[0] : '0';
  const prefix = numeric === '0' ? str : str.split(numeric)[0];

  const increment_string_num = str => {
    const inc = String(parseInt(str) + 1);
    return str.slice(0, str.length - inc.length) + inc;
  };

  return prefix + increment_string_num(numeric);
};
