import { SetMetadata } from '@nestjs/common';

export enum Permission {
  // User permissions
  READ_OWN_PROFILE = 'read:own:profile',
  UPDATE_OWN_PROFILE = 'update:own:profile',
  DELETE_OWN_PROFILE = 'delete:own:profile',

  // Vehicle permissions
  CREATE_VEHICLE = 'create:vehicle',
  READ_OWN_VEHICLES = 'read:own:vehicles',
  UPDATE_OWN_VEHICLES = 'update:own:vehicles',
  DELETE_OWN_VEHICLES = 'delete:own:vehicles',

  // Booking permissions
  CREATE_BOOKING = 'create:booking',
  READ_OWN_BOOKINGS = 'read:own:bookings',
  UPDATE_OWN_BOOKINGS = 'update:own:bookings',
  CANCEL_OWN_BOOKINGS = 'cancel:own:bookings',

  // Trip permissions
  CREATE_TRIP = 'create:trip',
  READ_OWN_TRIPS = 'read:own:trips',
  UPDATE_OWN_TRIPS = 'update:own:trips',
  CANCEL_OWN_TRIPS = 'cancel:own:trips',

  // Admin permissions
  READ_ALL_USERS = 'read:all:users',
  UPDATE_ANY_USER = 'update:any:user',
  SUSPEND_USER = 'suspend:user',
  DELETE_ANY_USER = 'delete:any:user',

  READ_ALL_VEHICLES = 'read:all:vehicles',
  APPROVE_VEHICLE = 'approve:vehicle',
  REJECT_VEHICLE = 'reject:vehicle',
  SUSPEND_VEHICLE = 'suspend:vehicle',

  READ_ALL_BOOKINGS = 'read:all:bookings',
  MANAGE_ANY_BOOKING = 'manage:any:booking',

  READ_FINANCIAL_REPORTS = 'read:financial:reports',
  MANAGE_PAYMENTS = 'manage:payments',

  // Root permissions
  MANAGE_ADMINS = 'manage:admins',
  SYSTEM_CONFIGURATION = 'system:configuration',
  ACCESS_SYSTEM_LOGS = 'access:system:logs',
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
