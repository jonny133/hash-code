const fs = require('fs');
const files = ['a', 'b', 'c', 'd', 'e'];
files.forEach((file) => {
  const inputFile = fs.readFileSync(`${file}.in`).toString().split("\n");
  const input = [];
  inputFile.forEach((row) => {
    input.push(row.split(" "));
  });

  const rows = input[0][0];
  const columns = input [0][1];
  const fleetSize = input[0][2];
  const rideNumber = input[0][3];
  const bonus = input[0][4];
  let currentStep = 0;
  const steps = input[0][5];
  let finish = false;

  const calculateDistance = (a, b) => {
    let xDistance = a[0] - b[0];
    let yDistance = a[1] - b[1];
    xDistance = xDistance > 0 ? xDistance : - xDistance;
    yDistance = yDistance > 0 ? yDistance : - yDistance;
    return xDistance + yDistance;
  }

  const rides = [];

  input.splice(0,1);
  console.log(input[0]);
  console.log(input[300]);
  console.log(input.length);

  input.forEach((ride, i) => {
    const startLocation = [ride[0], ride[1]];
    const endLocation = [ride[2], ride[3]];
    rides.push({
      startLocation,
      endLocation,
      journeyDistance: calculateDistance(startLocation, endLocation),
      startTime: ride[4],
      endTime: ride[5],
      taken: false,
      inputIndex: i
    });
  });

  const fleet = [];

  for (i = 0; i < fleetSize; i ++) {
    fleet.push({
      id: i,
      location: [0, 0],
      onRide: false,
      rideList: [],
      stepAvailble: 0,
      destination: [0, 0],
    });
  }

  const selectRide = (car, rides) => {
    // Returns index of best ride
    let bestRideIndex = 0;
    let bestRide = Object.assign({}, rides[0]);
    let newBestRide = false;
    bestRide.distanceFromCar = calculateDistance(car.location, bestRide.startLocation);
    rides.forEach((ride, i) => {
      const distanceFromCar = calculateDistance(car.location, ride.startLocation)
      if (currentStep + distanceFromCar === ride.startTime) {
        bestRide = Object.assign({}, ride, { distanceFromCar });
        newBestRide = true;
      }
    });
    if (newBestRide === false) {
      rides.forEach((ride, i) => {
        const distanceFromCar = calculateDistance(car.location, ride.startLocation)
        if (currentStep + distanceFromCar <= ride.startTime) {
          bestRide = Object.assign({}, ride, { distanceFromCar });
          newBestRide = true;
        }
      });
    }

    return bestRide;
  }

  const getAvailableCars = (fleet) => {
    return fleet.filter(car => car.stepAvailble === currentStep);
  }

  const getAvailableRides = (rides) => {
    return rides.filter(ride => ride.taken === false);
  }

  // Assuming more rides than fleet
  const init = () => {
    fleet.forEach((car) => {
      const availableRides = getAvailableRides(rides);
      const bestRide = selectRide(car, availableRides);
      car.rideList.push(bestRide.inputIndex);
      car.onRide = true;
      car.destination = bestRide.endLocation;
      car.location = bestRide.endLocation;
      car.stepAvailble = currentStep + bestRide.journeyDistance;
      rides[bestRide.inputIndex].taken = true;
    });
  }

  const step = () => {
    const availableCars = getAvailableCars(fleet);
    availableCars.forEach((car) => {
      const availableRides = getAvailableRides(rides);
      if (availableRides.length === 0) {
        finish = true;
        return 'Finished';
      } 
      const bestRide = selectRide(fleet[car.id], availableRides);
      fleet[car.id].rideList.push(bestRide.inputIndex);
      fleet[car.id].onRide = true;
      fleet[car.id].destination = bestRide.endLocation;
      fleet[car.id].location = bestRide.endLocation;    
      fleet[car.id].stepAvailble = currentStep + bestRide.journeyDistance;
      rides[bestRide.inputIndex].taken = true;
    });
    currentStep++;
  };

  const reward = () => {

  };

  init();

  for (i = 0; i < steps - 1; i++) {
    if (finish) {
      break;
    }
    step();
  }

  let writeString = '';
  fleet.forEach((car) => {
    writeString += car.rideList.length + ' ' + car.rideList.join(' ') + '\n';
  });

  fs.writeFile(
    'solution' + file.toUpperCase() + '.txt',
    writeString,
    function (err) { console.log(err ? 'Error :'+err : 'ok') }
  );
})
