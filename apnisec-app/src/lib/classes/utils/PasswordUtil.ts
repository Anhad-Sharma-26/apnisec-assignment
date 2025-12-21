import bcrypt from "bcryptjs";

export class PasswordUtil{
    private static readonly SALT_ROUNDS = 10;

    static async hash(password: string): Promise<string> {
        return await bcrypt.hash(password,this.SALT_ROUNDS);
    }

    static async compare(password: string, hash:string): Promise<boolean>{
        return await bcrypt.compare(password, hash);
    }

static validateStrength(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    return { isValid: true };
  }


}