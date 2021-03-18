import Knex from 'knex';

export enum Dialect {
  //mssql = "mssql",
  mysql = "mysql",
  mysql2 = "mysql2",
  //oracle = "oracle",
  oracledb = "oracledb",
  postgres = "postgres",
  redshift = "redshift",
  sqlite3 = "sqlite3",
}

// annoying
export function allDialects() {
  var dialects = []
  for (const d in Dialect) {
    dialects.push(d)
  }
  return dialects
}

export function translate(knexjs: string, dialect: string): [string, any[]] {
  const knex = Knex({client: dialect})
  try {
    const parsed = eval(knexjs).toSQL().toNative()
    return [parsed.sql, parsed.bindings];
  } catch {
    return ["syntax error", []]
  }
}

