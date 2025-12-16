export const isEligible = (lastDonationDate) => {
  if (!lastDonationDate) return true;
  const last = new Date(lastDonationDate);
  const now = new Date();
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  return diffDays >= 90;
};

export const nextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) return null;
  const last = new Date(lastDonationDate);
  const next = new Date(last);
  next.setDate(last.getDate() + 90);
  return next;
};

