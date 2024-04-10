export const imageDataToImage = (dataURL) => {
  const image = new Image();
  image.src = dataURL;
  return image;
};

export const isValidEmail = (email) => {
  // regex to validate email
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
};
