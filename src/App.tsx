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
import 'prismjs/themes/prism-solarizedlight.css'; // change the theme here

import { FormControl, InputLabel, Select, MenuItem, Typography, Table, TableHead, TableBody, TableRow, TableCell, Link, Paper, Grid, TableContainer } from '@material-ui/core';


// decompresses to: knex('change').select('me').count();
const DEFAULT_QUERY = "NYOwpgHgFA5AxgCwIYgOZhgSgHQGcwA2YcALrALYY5wD2AriGZgNxA";
const DEFAULT_DIALECT = Dialect.postgres;

export default function App() {
	const [dialect, setDialect] = useQueryString('dialect', DEFAULT_DIALECT);
	const [query, setQuery] = useQueryString('query', DEFAULT_QUERY);

	const updateDialect = useCallback((value: string) => {
		setDialect(value);
	}, [setDialect]);

	const updateQuery = useCallback((value: string) => {
		const compressed = LZString.compressToEncodedURIComponent(value);
		setQuery(compressed);
	}, [setQuery]);

	const displayQuery = LZString.decompressFromEncodedURIComponent(query) || "Unknown error";
	const [toQuery, sql, bindings] = translate(displayQuery, dialect);

	const noop = () => {};

	return (
		<div className='App'>
			{/* header */}
			<header><Typography variant='h2'>Knex QueryLab</Typography></header>

			<section>
				{/* body */}

				{/* body - select dialect */}
				<FormControl variant="outlined">
					<InputLabel id="dialect-select-label">Dialect</InputLabel>
					<Select className='dialect' labelId="dialect-select-label" value={dialect} onChange={(e) => updateDialect(e.target.value as string)} label="Dialect">
						{allDialects().map((d) => <MenuItem value={d}>{d}</MenuItem>)}
					</Select>
				</FormControl>

				<Typography className='subtitle' variant='h6'>Expression</Typography>

				{/* body - input knex query*/}
				<Paper>
					<Editor
						className='code'
						value={displayQuery}
						onValueChange={updateQuery}
						highlight={(code) => highlight(code, languages.javascript, 'javascript')} />
				</Paper>

				<Typography className='subtitle' variant='h6'>Query</Typography>

				{/* body - output sql*/}
				<Paper>
					<Editor
						className='code'
						disabled={true}
						value={toQuery}
						onValueChange={noop}
						highlight={(code) => highlight(code, languages.sql, 'sql')} />
				</Paper>

				<Typography className='subtitle' variant='h6'>SQL - Native</Typography>

				{/* body - output native*/}
				<Paper>
					<Editor
						className='code'
						disabled={true}
						value={sql}
						onValueChange={noop}
						highlight={(code) => highlight(code, languages.sql, 'sql')} />
				</Paper>

				{/* body - output bindings*/}
				<TableContainer	component={Paper} className='bindings'>
					<Table>
						<TableHead>
							<TableRow><TableCell style={{ width: '20px' }}>Binding</TableCell><TableCell>Value</TableCell></TableRow>
						</TableHead>
						<TableBody>
							{bindings.map((value, index) => {
								return (<TableRow key={index+1}>
									<TableCell>{index+1}</TableCell>
									<TableCell>{value}</TableCell>
								</TableRow>);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</section>

			{/* footer */}
			<footer>
				<Typography variant='body1'>
					Experiment with the <Link href='https://knexjs.org'>KnexJS</Link> API to build
					SQL. <Link href="https://github.com/michaelavila/knex-querylab">View source.</Link>
				</Typography>
			</footer>
		</div>
	);
};
