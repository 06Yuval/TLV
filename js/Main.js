let currParkingId = -1;

document.addEventListener('DOMContentLoaded', function() {
	$(".button-collapse").sideNav({
		edge: 'right',
		menuWidth: 300
	});

	loadParkings();

	document.addEventListener('click', parkingClick);

	document.getElementById("addParking").addEventListener("click", () => {
		enterAddMode();
	});

	document.getElementById("addModalAccept").addEventListener("click", () => {
		exitAddMode();
		addParking();
	});

	document.getElementById("addModalCancel").addEventListener("click", () => {
		exitAddMode();
		document.getElementById("newParking").remove();
	});

	document.getElementById("deleteParking").addEventListener("click", () => {
		deleteCurrParking();
	});
})

const parkingClick = (e) => {
	if (e.target && e.target.classList.contains('parking')) {
		document.getElementById("side-nav-toggle").click();
		loadSpecificParking(e.target.getAttribute("data-parking-id"));
	 }
 };

/**
 * Mark parking as taken
 */
const deleteCurrParking = () => {
const requestOptions = {
  method: 'DELETE'
};
fetch(`http://localhost:3000/api/parking/${currParkingId}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

/**
 * Add new parking
 */
const addParking = () => {
    // Getting the coords
	const coords = document.getElementById("newParkingCoord").getAttribute("value").replace("(", "").replace(")", "").split(",");
	const x = coords[0];
	const y = coords[1];
	const address = document.getElementById("newParkingAddress").value;

	const dataToSend = {
		x_coord: x,
		y_coord: y,
		address: address
	};
    
	fetch('http://localhost:3000/api/parkings', {
		method: 'POST',
		body: JSON.stringify(dataToSend),
		headers: {'content-type': 'application/json'}
	})
	.then(response => response.text())
	.then(result => console.log(result))
	.then((arr) => {
		drawParkings(arr);
	})
	.catch(error => console.log('error', error));
};

/**
 * Refresh the parkings that draws on the map (delete all and redraw them)
 */
const refreshParkings = () => {
	$(".button-collapse").sideNav("hide");
	Array.from(document.getElementsByClassName("parking")).forEach(e => e.remove());
	loadParkings();
}

/**
 * load all the parking from the server
 */
const loadParkings = () => {
	fetch('http://localhost:3000/api/parkings')
	.then((res)=> {
		return res;
	})
	.then((data) => {
		return data.json();
	})
	.then((arr) => {
		drawParkings(arr);
	})
};

/**
 * load specific parking's details
 * @param {int} id id of the parking to get details on
 */
const loadSpecificParking = (id) => {
	fetch(`http://localhost:3000/api/parkings/${id}`)
	.then((res) => res.json())
	.then((data) => showParkingDetails(data));

}

/**
 * Display a panel with the specific panel details
 * @param {object} parking the parking recived from the server to show
 */
const showParkingDetails = (parking) => {
	document.getElementById("exist_address").innerHTML = parking.address;
	document.getElementById("exist_x").innerHTML = parking.x_coord;
	document.getElementById("exist_y").innerHTML = parking.y_coord;
	document.getElementById("exist_time").innerHTML = new Date(parking.time).toLocaleString("he-IL");
	currParkingId = parking.id;
}

/**
 * Draw all the parkings on the map
 * @param {Array} arrParks The parkings to draw
 */
const drawParkings = (arrParks) => {
	arrParks.forEach((currParking) => {
		parkingDOM = document.createElementNS("http://www.w3.org/2000/svg", "image");
		parkingDOM.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/images/ParkingMaterial.png");
		parkingDOM.setAttribute("height", "53px");
		parkingDOM.setAttribute("width", "30px");
		parkingDOM.setAttribute("x", currParking.x_coord);
		parkingDOM.setAttribute("y", currParking.y_coord);
		parkingDOM.setAttribute("class", "parking button-collapse");
		parkingDOM.setAttribute("data-activates", "parking-side-nav");
		parkingDOM.setAttribute("data-parking-id", currParking.id);
		document.getElementsByTagName("svg")[0].appendChild(parkingDOM);
	});
}

const enterAddMode = () => {
	document.removeEventListener('click', parkingClick);
	
	var svg = document.getElementsByTagName("svg")[0];
	svg.addEventListener('mouseenter', addModeEnter);
	svg.addEventListener('mousemove', addModeMove);
	svg.addEventListener('mouseleave', addModeLeave);
	svg.addEventListener('click', addModeClick);
}

const addModeEnter = (e) => {
	parkingDOM = document.createElementNS("http://www.w3.org/2000/svg", "image");
	parkingDOM.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/images/ParkingMaterial.png");
	parkingDOM.setAttribute("height", "53px");
	parkingDOM.setAttribute("width", "30px");
	parkingDOM.setAttribute("x", e.offsetX);
	parkingDOM.setAttribute("y", e.offsetY);		
	parkingDOM.setAttribute("class", "parking button-collapse");
	parkingDOM.setAttribute("id", "newParking");

	document.getElementsByTagName("svg")[0].appendChild(parkingDOM);
}

const addModeLeave = (e) => {
	document.getElementsByTagName("svg")[0].removeEventListener("mouseenter", addModeEnter);
}

const addModeMove = (e) => {
	document.getElementById("newParking").setAttribute("x", e.offsetX - 15);
	document.getElementById("newParking").setAttribute("y", e.offsetY - 53);
}

const addModeClick = (e) => {
	document.getElementById("newParkingCoord").setAttribute("value", "(" + (e.offsetX - 15) + "," + (e.offsetY - 53) + ")");
	$("#addModal").openModal();
}

const exitAddMode = () => {
	var e = document.getElementsByTagName("svg")[0];
	e.removeEventListener("mouseenter", addModeEnter);
	e.removeEventListener("mouseleave", addModeLeave);
	e.removeEventListener("mousemove", addModeMove);
	e.removeEventListener("click", addModeClick);

	document.addEventListener('click', parkingClick);
}