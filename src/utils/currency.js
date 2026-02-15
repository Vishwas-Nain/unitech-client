export const formatPrice = (price) => {
  // Format price as INR with 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
  return formattedPrice;
};
