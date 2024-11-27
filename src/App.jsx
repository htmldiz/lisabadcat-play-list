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
export const ListItems = ({input, playlist,tablekeys,limit,offset}) => {
	const DefeInp = useDeferredValue(input);
	const items = useMemo(()=>{
		const newrrray = [];
		const Foundrrray = [];
		let Limiter = limit;
		if( tablekeys.length > 0 ){
			if(DefeInp !==""){
				let inputl = DefeInp.toLowerCase();
				playlist.forEach((item,ind) => {
					let canBeAdded = false;
					if(input !== '' && input.length >=3){
						tablekeys.map((key) => {
							if(item[key].toLowerCase().includes(inputl)){
								canBeAdded = true;
							}
						})
					}
					if(canBeAdded === true){
						// Foundrrray.push(item);
						// if(Limiter > 0 && ind > offset ){
							newrrray.push(<tr key={ind}>
								{
									tablekeys.map((key,ind) => {
										return <Td key={ind}>{item[key]}</Td>;
									})
								}
							</tr>);
						// }
						// Limiter--;
					}
				});
				// const pages = new Array(Math.ceil(Foundrrray.length / limit)).fill(0);
				// newrrray.push(
				// 	<tr>
				// 		<td colSpan={tablekeys.length} className={"text-center"}>
				// 			{
				// 				pages.map((i,ind) =>{
				// 					return <a href={"#"}>{ind + 1}</a>
				// 				})
				// 			}
				// 		</td>
				// 	</tr>
				// )
			}
			if(newrrray.length === 0){
				if(DefeInp === "" || DefeInp.length < 3 ){
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
	const {input,tablekeys,playlist,limit,offset} = props;
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
			{tablekeys.length > 0 && <ListItems input={input} playlist={playlist} tablekeys={tablekeys} limit={limit} offset={offset}/>}
			</tbody>
		</table>
	</div>;
}

function App() {
	const [count, setCount] = useState("")
	const [playlist, setPlaylist] = useState([])
	const [tablekeys, setTablekeys] = useState([])
	const [limit, setLimit] = useState(10);
	const [offset, setOffset] = useState(0)
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
					<label htmlFor="name" className="form__label">
						<svg className="icon" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24" fill="none">
							<path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
						<input id="name" className="form__field" placeholder="Search" type="text" typeof={"text"} onChange={(e) => {
							setCount(e.target.value);
						}}/>
					</label>
				</div>
			</div>
			<Table input={count} tablekeys={tablekeys} playlist={playlist} limit={limit} offset={offset}/>
		</>
	)
}

export default App
