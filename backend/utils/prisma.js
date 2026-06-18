const { PrismaClient } = require("@prisma/client");
const { PrismaPg }     = require("@prisma/adapter-pg");
const { Pool }         = require("pg");

const sslRequired = Boolean(process.env.DATABASE_URL?.match(/sslmode=\w+/));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(sslRequired && { ssl: { rejectUnauthorized: true } }),
});

const adapter = new PrismaPg(pool);
const prisma   = new PrismaClient({ adapter });

module.exports = { prisma, pool };
