const STORE = [
    { name: 'ALABAMA', abbreviation: 'AL'},
    { name: 'ALASKA', abbreviation: 'AK'},
    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    { name: 'ARIZONA', abbreviation: 'AZ'},
    { name: 'ARKANSAS', abbreviation: 'AR'},
    { name: 'CALIFORNIA', abbreviation: 'CA'},
    { name: 'COLORADO', abbreviation: 'CO'},
    { name: 'CONNECTICUT', abbreviation: 'CT'},
    { name: 'DELAWARE', abbreviation: 'DE'},
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    { name: 'FLORIDA', abbreviation: 'FL'},
    { name: 'GEORGIA', abbreviation: 'GA'},
    { name: 'GUAM', abbreviation: 'GU'},
    { name: 'HAWAII', abbreviation: 'HI'},
    { name: 'IDAHO', abbreviation: 'ID'},
    { name: 'ILLINOIS', abbreviation: 'IL'},
    { name: 'INDIANA', abbreviation: 'IN'},
    { name: 'IOWA', abbreviation: 'IA'},
    { name: 'KANSAS', abbreviation: 'KS'},
    { name: 'KENTUCKY', abbreviation: 'KY'},
    { name: 'LOUISIANA', abbreviation: 'LA'},
    { name: 'MAINE', abbreviation: 'ME'},
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    { name: 'MARYLAND', abbreviation: 'MD'},
    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
    { name: 'MICHIGAN', abbreviation: 'MI'},
    { name: 'MINNESOTA', abbreviation: 'MN'},
    { name: 'MISSISSIPPI', abbreviation: 'MS'},
    { name: 'MISSOURI', abbreviation: 'MO'},
    { name: 'MONTANA', abbreviation: 'MT'},
    { name: 'NEBRASKA', abbreviation: 'NE'},
    { name: 'NEVADA', abbreviation: 'NV'},
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    { name: 'NEW JERSEY', abbreviation: 'NJ'},
    { name: 'NEW MEXICO', abbreviation: 'NM'},
    { name: 'NEW YORK', abbreviation: 'NY'},
    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    { name: 'OHIO', abbreviation: 'OH'},
    { name: 'OKLAHOMA', abbreviation: 'OK'},
    { name: 'OREGON', abbreviation: 'OR'},
    { name: 'PALAU', abbreviation: 'PW'},
    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
    { name: 'PUERTO RICO', abbreviation: 'PR'},
    { name: 'RHODE ISLAND', abbreviation: 'RI'},
    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    { name: 'TENNESSEE', abbreviation: 'TN'},
    { name: 'TEXAS', abbreviation: 'TX'},
    { name: 'UTAH', abbreviation: 'UT'},
    { name: 'VERMONT', abbreviation: 'VT'},
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    { name: 'VIRGINIA', abbreviation: 'VA'},
    { name: 'WASHINGTON', abbreviation: 'WA'},
    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
    { name: 'WISCONSIN', abbreviation: 'WI'},
    { name: 'WYOMING', abbreviation: 'WY' }
];

function $renderStateList(){
	let $dropDownItems = ``;
	STORE.forEach(state => {
		$dropDownItems+=`<option value="${state.abbreviation}">${state.name}</option>`;
	});
	$('#state-dropdown-select').append($dropDownItems);
}

function queryParks(stateCode, resultCount=10){
	$('#park-listings').empty();
	const parameters = {
		stateCode: stateCode,
		limit: resultCount,
		api_key: '6UT3pYcealcHsuQYKEzQaeqUUki3ijXRUDUjMdOJ'
	}
	const searchApiUrl = 'https://developer.nps.gov/api/v1/parks';
	const paramStr = setParamStr(parameters);
	const endPoint = `${searchApiUrl}?${paramStr}`;

	fetch(endPoint)
		.then(errorHandler)
		.then(res => res.json())
		.then(parks => {
			parks.data.forEach(park => {
				$('#park-listings').append($renderPark(park));
			})
		})
		.catch(err => console.log(err))
}

function setParamStr(p){
	const queries = Object.keys(p)
		.map(query => `${encodeURIComponent(query)}=${encodeURIComponent(p[query])}`)
	return queries.join('&');
}

function errorHandler(res){
	if(!res.ok){ throw new Error(res.statusText); }
	return res;
};

function queryImg(coords, alt){
	if(coords != "" && coords.slice(0,4) == "lat:"){
		console.log(coords);
		const apiKey = `AIzaSyAh8qWOtN-vS2IFWA4ZdLidB0yA37vz7iE`;
		let latLong = coords.split(',');
		let lat = latLong[0].slice(4);
		let long = latLong[1].slice(6);
		return $(`<img class="park-image" alt="${alt}" src="https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=12&size=600x300&maptype=satellite
	&key=${apiKey}">`);
	} else {
		return $(`<div class="no-coordinates-found">No coordinates provided</div>`);
	}
}

function $renderPark(park){
	let $parkWrapper = $('<div class="park-wrapper">');
	$parkWrapper.append(`<h2 class="title">${park.fullName}</h2>
		<p class="description">${park.description}</p>
		<a href="${park.url}">${park.url}</a><br>
		<p>Aerial Photo</p>`);
	$parkWrapper.append(queryImg(`${park.latLong},${park.fullName}`));
	return $parkWrapper;
}

function eventHandlers(){
	$('form').submit(e => {
		e.preventDefault();
		queryParks($('#state-dropdown-select').val(), $('#result-count').val());
	});

}
$(function(){
	$renderStateList();
	eventHandlers();
})
