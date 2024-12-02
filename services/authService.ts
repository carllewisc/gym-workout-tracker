import { User } from '@/models/user';

export class AuthService {
  static async registerUser({ name, email, password }: { name: string; email: string; password: string }) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await User.create({
      name,
      email,
      password
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
  }

  static async validateUser(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}
