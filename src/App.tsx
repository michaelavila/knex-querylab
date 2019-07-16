import React, { useState } from 'react';
import Knex from 'knex';
import './App.css';

function translate(knexjs: string): string {
  const knex = Knex({client: 'postgres'})
  try {
    return eval(knexjs).toQuery();
  } catch {
    return "syntax error"
  }
}

const App: React.FC = () => {
  const [query, setQuery] = useState("knex('table');")

  return (
    <div className="App">
      <textarea onChange={(e) => setQuery(e.target.value || "")} value={query}></textarea>
      <p>{translate(query)}</p>
    </div>
  );
}

export default App;
