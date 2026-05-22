// server/src/services/booking.service.js
export const calculateBookingPrice = (vehicle, startDate, endDate, options = {}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) throw new Error('End date must be after start date');
  
  const subtotal = vehicle.dailyRate * totalDays;
  
  // Nigerian VAT is 7.5%
  const VAT_RATE = 0.075;
  const vat = subtotal * VAT_RATE;
  
  // Local government tax (varies by state, using 0.5% as example)
  const TAX_RATE = 0.005;
  const tax = subtotal * TAX_RATE;
  
  let driverFee = 0;
  if (options.driverRequired) {
    // Driver fee: ₦10,000 per day
    driverFee = 10000 * totalDays;
  }
  
  const grandTotal = subtotal + vat + tax + driverFee;
  
  return {
    totalDays,
    dailyRate: vehicle.dailyRate,
    subtotal,
    vat,
    tax,
    driverFee,
    grandTotal,
    currency: 'NGN'
  };
};

export const calculateLateFee = (returnDate, expectedReturnDate, dailyRate) => {
  const returnDateTime = new Date(returnDate);
  const expectedDateTime = new Date(expectedReturnDate);
  const lateDays = Math.ceil((returnDateTime - expectedDateTime) / (1000 * 60 * 60 * 24));
  
  if (lateDays <= 0) return 0;
  
  // Late fee: 150% of daily rate per day
  return dailyRate * 1.5 * lateDays;
};