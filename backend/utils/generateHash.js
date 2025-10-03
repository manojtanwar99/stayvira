import bcrypt from 'bcryptjs';

const generateHash = async () => {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  console.log('Password:', password);
  console.log('Hashed:', hashed);
  console.log('\nCopy this hash to your authController.js mockUser.password');
};

generateHash();