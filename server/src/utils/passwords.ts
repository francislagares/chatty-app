import { compareSync } from 'bcrypt';

export const compareHash = (
  password: string,
  hashedPassword: string,
): boolean => {
  return compareSync(password, hashedPassword);
};
