import { db } from "../database/index";       
import { users } from "../database/schema";
import { eq } from "drizzle-orm";


export default class User {
    id: number;
    email: string;
    full_name: string | null;
    password_hash: string;
    created_at: Date;
    constructor(id: number, email: string, full_name: string | null, password_hash: string, created_at: Date) {
        this.id = id;
        this.email = email;
        this.full_name = full_name;
        this.password_hash = password_hash;
        this.created_at = created_at;
    }
   static async createUser(userData: {
    email: string;
    full_name?: string;
    password_hash: string;
  }): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(userData)
      .returning();

    return new User(
      newUser.id,
      newUser.email,
      newUser.full_name,
      newUser.password_hash,
      newUser.created_at
    );
  }
  static async findByEmail(email: string): Promise<User | null> {
    const userRow = await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0]);
    if (!userRow) return null;

    return new User(
      userRow.id,
      userRow.email,
      userRow.full_name,
      userRow.password_hash,
      userRow.created_at
    );
  }
}