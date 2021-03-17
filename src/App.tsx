import React, { useCallback, ChangeEvent } from 'react';

import LZString from 'lz-string';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './App.css';
import { Dialect, allDialects, translate } from './querylab';
import { useQueryString } from './use-query-string';

// decompresses to: knex('change').select('me').count();
const DEFAULT_QUERY = "NYOwpgHgFA5AxgCwIYgOZhgSgHQGcwA2YcALrALYY5wD2AriGZgNxA";

const DEFAULT_DIALECT = Dialect.postgres;

export default function App() {
	const [dialect, setDialect] = useQueryString('dialect', DEFAULT_DIALECT);
	const [query, setQuery] = useQueryString('query', DEFAULT_QUERY);

	const updateDialect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setDialect(e.target.value);
	}, [setDialect]);

	const updateQuery = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
		const compressed = LZString.compressToEncodedURIComponent(e.target.value);
		setQuery(compressed);
	}, [setQuery]);

	const displayQuery = LZString.decompressFromEncodedURIComponent(query) || "Unknown error";

	return (
		<div className='App'>
			{/* header */}
			<div><h1>Knex QueryLab</h1></div>

			{/* body */}
			{/* body - select dialect */}
			<div>
				<select value={dialect} onChange={updateDialect}>
					{allDialects().map((d, i) => { return <option key={i} value={d}>{d}</option> })}
				</select>
			</div>

			{/* body - input knex query*/}
			<div><textarea onChange={updateQuery} value={displayQuery}></textarea></div>

			{/* body - output sql*/}
			<div><code>{translate(displayQuery, dialect)}</code></div>

			{/* footer */}
			<div>
				<span>
					Experiment with the <a href='https://knexjs.org'>KnexJS</a> API to build
					SQL. <a href="https://github.com/michaelavila/knex-querylab">View source.</a>
				</span>
			</div>
		</div>
	);
};
