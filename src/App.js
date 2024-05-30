import { createContext, useContext, useReducer, useState } from 'react';

const DateContext = createContext();

const initialState = {
	day: '--',
	month: '--',
	year: '--',
};

function minusDates(date) {
	const curDate = new Date();
	// const date2 = new Date('12/15/2018');
	const diffTime = Math.abs(curDate - date);
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	// console.log(diffTime + ' milliseconds');
	// console.log(diffDays + ' days');
	const years = Math.floor(diffDays / 365);
	const months = Math.floor((diffDays % 365) / 30.5);
	const days = Math.floor((diffDays % 365) % 30.5);
	// console.log(yrs, month, days);
	return { years, months, days };
}

function reducer(state, action) {
	switch (action.type) {
		case 'dateSubmit':
			const { years, months, days } = minusDates(
				new Date(
					`${action.payload.month}/${action.payload.day}/${action.payload.year}`
				)
			);
			return { ...state, day: days, month: months, year: years };
		default:
			throw new Error('Invalid case');
	}
}

function DateProvider({ children }) {
	const [{ day, month, year }, dispatch] = useReducer(reducer, initialState);

	return (
		<DateContext.Provider value={{ dispatch, day, month, year }}>
			{children}
		</DateContext.Provider>
	);
}

function useDate() {
	const context = useContext(DateContext);
	if (context === undefined) throw new Error('Context not defined ');
	return context;
}

function App() {
	return (
		<div className="app">
			<h2>Enter your birthday</h2>
			<DateProvider>
				<Form />
				<Results />
			</DateProvider>
		</div>
	);
}
const initial = {
	dayError: null,
	monthError: null,
	yearError: null,
};

function reducerError(state, action) {
	switch (action.type) {
		case 'dayError':
			return { ...state, dayError: action.payload };
		case 'monthError':
			return { ...state, monthError: action.payload };
		case 'yearError':
			return { ...state, yearError: action.payload };
		case 'reset':
			return initial;
		default:
			throw new Error('no such case');
	}
}

function Form() {
	const { dispatch } = useDate();
	const [day, setDay] = useState('DD');
	const [month, setMonth] = useState('MM');
	const [year, setYear] = useState('YYYY');
	const [count, setCount] = useState(0);
	const [{ dayError, monthError, yearError }, dispatchError] = useReducer(
		reducerError,
		initial
	);

	function handleSubmit(e) {
		e.preventDefault();
		dispatchError({ type: 'reset' });
		if (!day) {
			dispatchError({ type: 'dayError', payload: 'Enter day' });
		} else if (day < 1 || 31 < day) {
			dispatchError({ type: 'dayError', payload: 'Enter valid day' });
		}

		if (!month) {
			dispatchError({ type: 'monthError', payload: 'Enter month' });
		} else if (month < 1 || 12 < month) {
			dispatchError({ type: 'monthError', payload: 'Enter valid month' });
		}

		if (!year) {
			dispatchError({ type: 'yearError', payload: 'Enter the year' });
		} else if (year < 1 || new Date().getFullYear() < year) {
			dispatchError({ type: 'yearError', payload: 'Enter valid year' });
		}

		if (dayError || monthError || yearError) {
			setDay('DD');
			setMonth('MM');
			setYear('YYYY');
			return;
		}

		dispatch({ type: 'dateSubmit', payload: { day, month, year } });
		setDay('DD');
		setMonth('MM');
		setYear('YYYY');
		setCount(0);
	}

	function handleChange(e) {
		let { name, value } = e.target;

		if (isNaN(Number(e.target.value))) return;

		if (name === 'day') setDay(Number(e.target.value));
		if (name === 'month') setMonth(Number(e.target.value));
		if (name === 'year') setYear(Number(e.target.value));
	}

	function handleFocus() {
		dispatchError({ type: 'reset' });
		if (count) return;

		setCount(1);
		setDay(0);
		setMonth(0);
		setYear(0);
	}

	return (
		<form className="form" onSubmit={handleSubmit}>
			<div className="inputs">
				<label htmlFor="">day</label>
				<input
					value={day}
					onFocus={handleFocus}
					name="day"
					onChange={handleChange}
					type="text"
					placeholder="DD"
				/>
				<p className="error">{dayError ? dayError : ''}</p>
			</div>
			<div className="inputs">
				<label htmlFor="">month</label>
				<input
					value={month}
					onFocus={handleFocus}
					name="month"
					onChange={handleChange}
					type="text"
					placeholder="MM"
				/>
				<p className="error">{monthError ? monthError : ''} </p>
			</div>
			<div className="inputs">
				<label htmlFor="">year</label>
				<input
					value={year}
					onFocus={handleFocus}
					name="year"
					onChange={handleChange}
					type="text"
					placeholder="yyyy"
				/>
				<p className="error"> {yearError ? yearError : ''} </p>
			</div>
			<button className="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="46"
					height="44"
					viewBox="0 0 46 44"
				>
					<g fill="none" stroke="#fff" stroke-width="2">
						<path d="M1 22.019C8.333 21.686 23 25.616 23 44M23 44V0M45 22.019C37.667 21.686 23 25.616 23 44" />
					</g>
				</svg>
			</button>
		</form>
	);
}

function Results() {
	const { day, month, year } = useDate();
	const isYear = day && month && year ? true : false;
	return (
		<div className="results">
			<div className="year">
				{isYear ? <strong>{year}</strong> : <strong>--</strong>}
				<strong>years</strong>
			</div>
			<div className="month">
				{isYear ? <strong>{month}</strong> : <strong>--</strong>}
				<strong>month</strong>
			</div>
			<div className="day">
				{isYear ? <strong>{day}</strong> : <strong>--</strong>}
				<strong>days</strong>
			</div>
		</div>
	);
}

export default App;
