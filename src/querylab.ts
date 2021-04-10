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

export function translate(knexjs: string, dialect: string): [string, string, any[]] {
  const knex = Knex({client: dialect})
  try {
    const parsed = eval(knexjs);
    const query = `${parsed.toQuery()};`;
    const native = parsed.toSQL().toNative();
    const nativeQuery = `${native.sql};`;
    return [query, nativeQuery, native.bindings];
  } catch {
    return ["syntax error", "", []]
  }
}

