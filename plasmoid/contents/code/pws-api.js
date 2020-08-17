/*
 * Copyright 2020  Kevin Donnelly
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http: //www.gnu.org/licenses/>.
 */
function getWeatherData() {
	errorStr = null;

	var req = new XMLHttpRequest();

	req.open(
		"GET",
		"https://api.weather.com/v2/pws/observations/current?stationId=" +
			stationID +
			"&format=json&units=e&apiKey=676566f10f134df1a566f10f13edf108&numericPrecision=decimal",
		true
	);

	req.setRequestHeader("Accept-Encoding", "gzip");

	req.onerror = function () {
		errorStr = "Request couldn't be sent" + req.statusText;

		weatherData = null;
		showData = false;

		printDebug(errorStr);
	};

	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				var res = JSON.parse(req.responseText);
				weatherData = res["observations"][0];

				loadingData = false;
				showData = true;
				errorStr = null;

				printDebug("Got new data");
			} else {
				setErrorState();
				if (req.status == 204) {
					errorStr = "Station not found";

					printDebug(errorStr);
				} else {
					errorStr = "Request failed: " + req.responseText;

					printDebug(errorStr);
				}
			}
		}
	};

	req.send();
}

/**
 * Set variables to show errorStr
 */
function setErrorState() {
	weatherData = null;
	showData = false;
	configActive = false;
	loadingData = false;
}