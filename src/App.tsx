import Knex from 'knex';
import LZString from 'lz-string';
import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import qs, { ParsedQuery } from 'query-string';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './App.css';
import { isArray } from 'util';

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

function translate(knexjs: string, dialect: string): string {
    const knex = Knex({client: dialect})
    try {
        return eval(knexjs).toSQL().sql;
    } catch {
        return "syntax error"
    }
}

function setQueryStringWithoutPageReload(qsValue: string) { 
    const newurl = window.location.protocol + "//"
    + window.location.host + window.location.pathname + qsValue;

    window.history.pushState({ path: newurl }, "", newurl);
};

function setQueryStringValue(key: string, value: string, queryString: string = window.location.search) {
    const values = qs.parse(queryString);
    const newQsValue = qs.stringify({...values, [key]: value });
    setQueryStringWithoutPageReload(`?${newQsValue}`);
};

function getQueryStringValue(key: string, queryString: string = window.location.search): string | null {
    const values: ParsedQuery = qs.parse(queryString); 
    const value: string | string[] | null = values[key];
    if (isArray(value)) {
        return value[0];
    } else {
        return value
    }
};

function useQueryString(key: string, initialValue: string): [string, Dispatch<SetStateAction<string>>] {
    const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
    const onSetValue = useCallback(
        newValue => {
            setValue(newValue);
            setQueryStringValue(key, newValue);
        },
        [key]
    );

    return [value, onSetValue];
}

const App: React.FC = () => {
    const [dialect, setDialect] = useQueryString('dialect', Dialect.sqlite3)
    const [query, setQuery] = useQueryString('query', LZString.compressToEncodedURIComponent("knex('change').select('me').count();"));

    const displayQuery = LZString.decompressFromEncodedURIComponent(query) || "Unknown error";

    return (
        <div className='App'>
            <h2>Knex QueryLab</h2>
            <h6>
                Experiment with the <a href='https://knexjs.org'>KnexJS</a> API to build
                SQL. <a href="https://github.com/michaelavila/knex-querylab">Also, view source.</a>
            </h6>

            <div>
                <select className="dialectSelect" value={dialect} onChange={(event) => setDialect(event.target.value as Dialect)}>
                    {allDialects().map((d, i) => {
                        return <option key={i} value={d}>{d}</option>
                    })}
                </select>
            </div>

            <textarea className="expressionInput" onChange={(e) => setQuery(LZString.compressToEncodedURIComponent(e.target.value))} value={displayQuery}></textarea>
            <div className="sql">
                <SyntaxHighlighter language="sql" style={tomorrow}>{translate(displayQuery, dialect)}</SyntaxHighlighter>
            </div>
        </div>
    );
}

export default App;
