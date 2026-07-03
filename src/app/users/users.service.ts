import { Service, signal } from '@angular/core';
import { fakerFR as faker } from '@faker-js/faker';
import { User } from './user';

const USER_COUNT = 12;
const USER_SEED = 20260703;

const USER_ROLES = [
  'Angular Lead Developer',
  'Frontend Engineer',
  'Fullstack Developer',
  'Design System Engineer',
  'Software Architect',
  'Developer Experience Engineer',
] as const;

const AVATAR_COLORS = [
  '#3374ff',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
] as const;

@Service()
export class UsersService {
  private readonly users = signal<User[]>(this.createUsers());

  getUserById(userId: number): User | undefined {
    return this.users().find((user) => user.id === userId);
  }

  getAllUsers(): User[] {
    return this.users();
  }

  private createUsers(): User[] {
    faker.seed(USER_SEED);

    return Array.from({ length: USER_COUNT }, (_, userIndex) =>
      this.createUser({ userIndex })
    );
  }

  private createUser(options: { readonly userIndex: number }): User {
    const fullName = faker.person.fullName();
    const firstName = fullName.split(' ')[0] ?? fullName;
    const role = faker.helpers.arrayElement(USER_ROLES);

    return {
      id: options.userIndex + 1,
      name: fullName,
      email: faker.internet.email({ firstName }).toLowerCase(),
      role,
      bio: `${faker.person.bio()} Focus: ${role.toLowerCase()}.`,
      initials: this.getInitials({ fullName }),
      color: AVATAR_COLORS[options.userIndex % AVATAR_COLORS.length],
    };
  }

  private getInitials(options: { readonly fullName: string }): string {
    return options.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((namePart) => namePart[0]?.toUpperCase() ?? '')
      .join('');
  }
}
