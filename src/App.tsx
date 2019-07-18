import Knex from 'knex';
import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import './App.css';

enum Dialect {
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
function allDialects() {
  var dialects = []
  for (const d in Dialect) {
    dialects.push(d)
  }
  return dialects
}

function translate(knexjs: string, dialect: Dialect): string {
  const knex = Knex({client: dialect})
  try {
    return eval(knexjs).toQuery();
  } catch {
    return "syntax error"
  }
}

const App: React.FC = () => {
  const [query, setQuery] = useState("knex('change').select('me').count();")
  const [dialect, setDialect] = useState(Dialect.sqlite3)

  return (
    <Container className='App'>
      <Typography variant='h2'>Knex Query Lab</Typography>
      <Typography variant='subtitle1'>
        Experiment with the <a href='https://knexjs.org'>KnexJS</a> API to build
        SQL. <a href="https://github.com/michaelavila/knex-querylab">Also, view source.</a>
      </Typography>

      <div>
        <Select className="dialectSelect" value={dialect} onChange={(event) => setDialect(event.target.value as Dialect)}>
        {allDialects().map((d, i) => {
          return <MenuItem key={i} value={d}>{d}</MenuItem>
        })}
        </Select>
      </div>

      <TextField className="expressionInput" multiline={true} onChange={(e) => setQuery(e.target.value || "")} value={query}></TextField>
      <code>{translate(query, dialect)}</code>
    </Container>
  );
}

export default App;
