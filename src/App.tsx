import React, { useCallback, ChangeEvent } from 'react';
import './App.css';

// querylab lib code
import { Dialect, allDialects, translate } from './querylab';

// used for LZ compress query and store in query string
import LZString from 'lz-string';
import { useQueryString } from './use-query-string';

//
// code editor and syntax highlighter
//
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css'; // change the theme here


// decompresses to: knex('change').select('me').count();
const DEFAULT_QUERY = "NYOwpgHgFA5AxgCwIYgOZhgSgHQGcwA2YcALrALYY5wD2AriGZgNxA";
const DEFAULT_DIALECT = Dialect.postgres;

export default function App() {
	const [dialect, setDialect] = useQueryString('dialect', DEFAULT_DIALECT);
	const [query, setQuery] = useQueryString('query', DEFAULT_QUERY);

	const updateDialect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
		setDialect(e.target.value);
	}, [setDialect]);

	const updateQuery = useCallback((value: string) => {
		const compressed = LZString.compressToEncodedURIComponent(value);
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
			<div>
				<Editor
					value={displayQuery}
					onValueChange={updateQuery}
					highlight={(code) => highlight(code, languages.javascript, 'javascript')} />
			</div>

			{/* body - output sql*/}
			<div>
				<Editor
					disabled={true}
					value={translate(displayQuery, dialect)}
					onValueChange={(value) => console.log(value)}
					highlight={(code) => highlight(code, languages.sql, 'sql')} />
			</div>

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
