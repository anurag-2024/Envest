export const getOrCreateUserId = () => {
  let userId = localStorage.getItem('portfolio_user_id');
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('portfolio_user_id', userId);
  }
  console.log('User ID:', userId);
  return userId;
};