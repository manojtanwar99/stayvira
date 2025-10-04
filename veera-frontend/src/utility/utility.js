export const getImageUrl = (imagePath) => {
  const IMAGE_BASE_URL = "http://localhost:5000";
  if (!imagePath) return null;
  return `${IMAGE_BASE_URL}/${imagePath}`;
};