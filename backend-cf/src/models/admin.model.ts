import { D1Database } from "@cloudflare/workers-types";

export class AdminModel {
    constructor(private db: D1Database) { }

    async findByUsername(username: string) {
        return await this.db
            .prepare("SELECT * FROM admins WHERE username = ?")
            .bind(username)
            .first();
    }
}
