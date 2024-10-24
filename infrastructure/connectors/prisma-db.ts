import { PrismaClient } from "@prisma/client";

export abstract class PrismaClientConfig {
    private _prisma: PrismaClient;
    constructor() {
        this._prisma = this.initialize();
    }
    private initialize() {
        if (!this._prisma) {
            return new PrismaClient();
        }
        return this._prisma;
    }
    protected get prisma() {
        return this._prisma;
    }
}
