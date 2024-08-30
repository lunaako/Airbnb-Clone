export const formatRating = (num) => {
  // Use toFixed(2) to get the number with exactly two decimal places
  let formattedNum = num.toFixed(2);

  // Replace one trailing zero if it exists
  formattedNum = formattedNum.replace(/\.0$/, '.0').replace(/(\.\d)0$/, '$1');

  return formattedNum;
}
