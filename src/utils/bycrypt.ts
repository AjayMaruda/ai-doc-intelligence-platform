import bycrypt from 'bcrypt';

export const hashPassword = async function (password: string) {
  return await bycrypt.hash(password, 12);
};

export const comparePassword = async function (
  password: string,
  hashedPassword: string,
) {
  return await bycrypt.compare(password, hashedPassword);
};
