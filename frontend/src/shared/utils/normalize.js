export const currencyFormat = num => {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'đ';
};

export const getCodeByName = name => {
  return name
    .trim()
    .split(' ')
    .map(string => string[0])
    .join('')
    .replaceAll(' ', '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};
