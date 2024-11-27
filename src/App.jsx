import {useDeferredValue, useEffect, useMemo, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import fetch from 'unfetch'
import useSWR from 'swr'
import './App.css'
export const capitalize = (str) => str?.replace(/\b\w/g, substr => substr.toUpperCase())
// https://raw.githubusercontent.com/htmldiz/play-list-repo-example/main/playlist.json

const fetcher = url => fetch(url).then(r => r.json())

export const Td = ({children}) => {
	return <td>{children}</td>
}
export const Th = (props) => {
	const {children} = props;
	return <th>{children}</th>
}
export const ListItems = ({input, playlist,tablekeys}) => {
	const DefeInp = useDeferredValue(input);
	const items = useMemo(()=>{
		const newrrray = [];
		if( tablekeys.length > 0 ){
			if(DefeInp !==""){
				let inputl = DefeInp.toLowerCase();
				playlist.forEach((item,ind) => {
					let canBeAdded = false;
					if(input !== '' && input.length > 3){
						tablekeys.map((key) => {
							if(item[key].toLowerCase().includes(inputl)){
								canBeAdded = true;
							}
						})
					}
					if(canBeAdded === true){
						newrrray.push(<tr key={ind}>
							{
								tablekeys.map((key,ind) => {
									return <Td key={ind}>{item[key]}</Td>;
								})
							}
						</tr>);
					}
				});
			}
			if(newrrray.length === 0){
				if(DefeInp === "" || DefeInp.length <3 ){
					newrrray.push(
						<tr>
							<td colSpan={tablekeys.length} className={"text-center"}>Use search input!</td>
						</tr>
					)
				}else{
					newrrray.push(
						<tr>
							<td colSpan={tablekeys.length} className={"text-center"}>Nothing found!</td>
						</tr>
					)
				}
			}
		}
		return newrrray;
	}, [DefeInp]);
	return items;
}
export const Table = (props) => {
	const {input,tablekeys,playlist} = props;
	if(typeof playlist != "object"){
		return <></>;
	}
	// const list = List(input);
	return <div className={"table"}>
		<table className={"table-fill"}>
			<thead>
			<tr>
				{tablekeys.map((key,ind) => {
					return <Th key={ind}>{capitalize(key)}</Th>;
				})}
			</tr>
			</thead>
			<tbody>
			{tablekeys.length > 0 && <ListItems input={input} playlist={playlist} tablekeys={tablekeys}/>}
			</tbody>
		</table>
	</div>;
}

function App() {
	const [count, setCount] = useState("")
	const [playlist, setPlaylist] = useState([])
	const [tablekeys, setTablekeys] = useState([])
	useEffect( () => {
		let ignore = false;
		fetcher('https://raw.githubusercontent.com/htmldiz/play-list-repo-example/main/playlist.json').then(data => {
			if (!ignore) {
				if(data) {
					setPlaylist(data);
					setTablekeys(Object.keys(data[0]))
				}
			}
		})
		return () => {
			ignore = true;
		};
	}, [])
	return (
		<>
			<h1>Playlist</h1>
			<div className="top-search">
				<a href={"https://www.twitch.tv/lisabadcat/"} className="top-search-link">
					<img src="/lisabadcat.png" className={"img"} alt={"lisabadcat"}/> <span className={"text-left"}>
						<span className="top-search-name">
							<span className="black-t">lisabadcat</span>
							<svg width="16" height="16" viewBox="0 0 16 16" aria-label="Verified Partner"><path fillRule="evenodd" d="M12.5 3.5 8 2 3.5 3.5 2 8l1.5 4.5L8 14l4.5-1.5L14 8l-1.5-4.5ZM7 11l4.5-4.5L10 5 7 8 5.5 6.5 4 8l3 3Z" clipRule="evenodd"></path></svg></span>
						<span className="follow">Follow</span>
					</span>
				</a>
				<div className="form__group field">
					<input className="form__field" placeholder="Name" type="text" typeof={"text"} onChange={(e) => {
						setCount(e.target.value);
					}}/>
					<label htmlFor="name" className="form__label">Search</label>
				</div>
			</div>
			<Table input={count} tablekeys={tablekeys} playlist={playlist}/>
		</>
	)
}

export default App
