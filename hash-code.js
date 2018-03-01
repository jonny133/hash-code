const input = [
  [3, 4, 2, 3, 2, 10],
  [0, 0, 1, 3, 2, 9],
  [1, 2, 1, 0, 0, 9],
  [2, 0 , 2, 2, 0, 9]
]

const rows = input[0][0];
const columns = input [0][1];
const fleetSize = input[0][2];
const rideNumber = input[0][3];
const bonus = input[0][4];
const steps = input[0][5];

const calculateDistance = (a, b) => {
  let xDistance = a[0] - b[0];
  let yDistance = a[1] - b[1];
  xDistance = xDistance > 0 ? xDistance : - xDistance;
  yDistance = yDistance > 0 ? yDistance : - yDistance;
  return xDistance + yDistance;
}

const rides = [];

input.splice(0,1);

input.forEach((ride) => {
  const startLocation = [ride[0], ride[1]];
  const endLocation = [ride[2], ride[3]];
  rides.push({
    startLocation,
    endLocation,
    journeyDistance: calculateDistance(startLocation, endLocation),
    startTime: ride[4],
    endTime: ride[5],
    taken: false,
  });
});

const fleet = [];

for (i = 0; i < fleetSize; i ++) {
  fleet.push({
    id: i,
    location: [0, 0],
    onRide: false,
    rideList: []
  });
}

const selectRide = (car, rides) => {
  // Returns index of best ride
  let bestRideIndex;
  let bestRide;
  rides.forEach((ride, i) => {
    console.log(ride.taken);
    if (ride.taken === false) {
      bestRide.distanceFromCar = calculateDistance(car.location, bestRide.startLocation);
      const distanceFromCar = calculateDistance(car.location, ride.startLocation)
      if (distanceFromCar < bestRide.distanceFromCar) {
        bestRide = Object.assign({}, ride, { distanceFromCar });
        bestRideIndex = i;
      }
    }
  });

  return bestRideIndex;
}

// Assuming more rides than fleet
const init = () => {
  fleet.forEach((car) => {
    rideIndex = selectRide(car, rides);
    car.rideList.push(rides[rideIndex]);
    car.onRide = true;
    rides[rideIndex].taken = true;
  });
}

const step = () => {

};

const reward = () => {

};
init();
console.log(rides);
console.log(fleet);
console.log(fleet[0].rideList);
console.log(fleet[1].rideList);