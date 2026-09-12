import { pgTable, text, timestamp, boolean, integer, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('zivora_users', {
  id: text('id').primaryKey(), email: text('email').unique(), password: text('password'),
  name: text('name').notNull(), city: text('city').notNull().default('Bengaluru'), bio: text('bio').notNull().default(''),
  age: integer('age').notNull().default(25), intent: text('intent').notNull().default('Friendship'),
  role: text('role').notNull().default('member'), demo: boolean('demo').notNull().default(false),
  incognito: boolean('incognito').notNull().default(false), adult: boolean('adult').notNull().default(false),
  suspended: boolean('suspended').notNull().default(false), createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const sessions = pgTable('zivora_sessions', {
  token: text('token').primaryKey(), userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
});
export const profiles = pgTable('zivora_profiles', {
  id: text('id').primaryKey(), name: text('name').notNull(), age: integer('age').notNull(), city: text('city').notNull(),
  distance: integer('distance').notNull(), bio: text('bio').notNull(), intent: text('intent').notNull(),
  interests: jsonb('interests').$type<string[]>().notNull(), image: text('image').notNull(),
  verified: boolean('verified').default(true).notNull(), online: boolean('online').default(false).notNull(),
  compatibility: integer('compatibility').default(90).notNull(),
});
export const resources = pgTable('zivora_resources', {
  id: text('id').primaryKey(), kind: text('kind').notNull(), ownerId: text('owner_id').notNull(),
  title: text('title').notNull(), description: text('description').notNull(), category: text('category').notNull(),
  city: text('city').notNull().default('Bengaluru'), image: text('image').notNull().default(''),
  location: text('location').notNull().default(''), date: text('date').notNull().default(''),
  capacity: integer('capacity').notNull().default(50), members: integer('members').notNull().default(0),
  status: text('status').notNull().default('active'), createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const actions = pgTable('zivora_actions', {
  id: text('id').primaryKey(), userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetId: text('target_id').notNull(), kind: text('kind').notNull(), createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => [uniqueIndex('zivora_action_unique').on(table.userId, table.targetId, table.kind)]);
export const messages = pgTable('zivora_messages', {
  id: text('id').primaryKey(), userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  profileId: text('profile_id').notNull(), text: text('text').notNull(), incoming: boolean('incoming').notNull().default(false),
  read: boolean('read').notNull().default(false), createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const reports = pgTable('zivora_reports', {
  id: text('id').primaryKey(), userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetId: text('target_id').notNull(), reason: text('reason').notNull(), details: text('details').notNull(),
  status: text('status').notNull().default('open'), createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const posts = pgTable('zivora_posts', {
  id: text('id').primaryKey(), resourceId: text('resource_id').notNull().references(() => resources.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(), author: text('author').notNull(), text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const auditLogs = pgTable('zivora_audit_logs', {
  id: text('id').primaryKey(), userId: text('user_id').notNull(), action: text('action').notNull(), targetId: text('target_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const leads = pgTable('zivora_leads', {
  id: text('id').primaryKey(), userId: text('user_id'),
  name: text('name').notNull().default(''), email: text('email').notNull().default(''),
  source: text('source').notNull().default('feedback'),
  status: text('status').notNull().default('new'), details: text('details').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
