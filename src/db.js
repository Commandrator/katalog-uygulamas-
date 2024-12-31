import { readFileSync, writeFileSync } from 'fs';
class DB {
    constructor() {
        this.path = process.env.DBPATH;
        this.db = JSON.parse(readFileSync(this.path, 'utf8'));
    }
    getDB() {
        return this.db;
    }
    updateDB(newData) {
        this.db = newData;
        writeFileSync(this.path, JSON.stringify(this.db, null, 2), 'utf8');
    }
    static ReadDB(path) {
        const data = readFileSync(path, 'utf8');
        return JSON.parse(data);
    }
}

export { DB };
