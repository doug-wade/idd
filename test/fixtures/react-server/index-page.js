import '../build/styles/index.css';
import React from 'react';
import {RootElement} from 'react-server';
import idd from 'idd';

const {actions, config, stores, components} = idd('..');
const {Header, Map, Footer} = components;

export default class IndexPage {
	handleRoute(next) {
		if (!config.SERVER_SIDE) {
			actions.pageView('index');
		}
		return next();
	}

	getTitle() {
		return 'React Server Earthquake Page';
	}

	getElements() {
		return [
			<RootElement key={0}>
				<Header/>
			</RootElement>,
			<RootElement when={stores.earthquakeStore} key={1}>
				<Map/>
			</RootElement>,
			<RootElement key={2}>
				<Footer/>
			</RootElement>
		];
	}
}
