import { compare } from 'bcrypt';

export const compareHash = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return compare(password, hashedPassword);
};
