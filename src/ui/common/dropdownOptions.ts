import { UserRole } from 'shared/ApiClient';

export const userRoleOptions = Object.values(UserRole).map(value => ({ label: value, value }));