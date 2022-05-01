import * as bcrypt from 'bcryptjs';

export const hashPassword = async (
  password: string,
): Promise<{ salt: string; hash: string }> => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => bcrypt.compare(password, hash);
