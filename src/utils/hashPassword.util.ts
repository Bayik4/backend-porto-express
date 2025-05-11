import bcrypt from 'bcrypt';

export const hashPassword = async (plainTextPassword: string) => {
  const saltRound = 10; 
  return await bcrypt.hash(plainTextPassword, saltRound);
}

export const verifyPassword = (plainTextPassword: string, hasedPassword: string) => {
  return bcrypt.compare(plainTextPassword, hasedPassword);
}