import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, text, integer, index, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  full_name: text("full_name"),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const urls = pgTable("links", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id"),
  short_link: varchar("short_link", { length: 12 }).notNull().unique(),
  original_link: text("original_link").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  refresh_token: varchar("refresh_token", { length: 255 }).notNull().unique(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  urls: many(urls),
  sessions: many(sessions),
}));

export const urlsRelations = relations(urls, ({ one }) => ({
  user: one(users, { fields: [urls.user_id], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.user_id], references: [users.id] }),
}));