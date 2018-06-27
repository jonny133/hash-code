# -*- coding: utf-8 -*-
"""
Original author: djangofs
@author: Jonny133
"""

import copy

infiles = ['a', 'b', 'c', 'd', 'e']


def calculateDistance(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


class Ride(object):
    def __init__(self, startLocation, endLocation, startTime, endTime, inputIndex):
        self._startLocation = startLocation
        self._endLocation = endLocation
        self._journeyDistance = calculateDistance(startLocation, endLocation)
        self._startTime = startTime
        self._endTime = endTime
        self._inputIndex = inputIndex
        self._taken = False

    @property
    def startLocation(self):
        return self._startLocation

    @property
    def endLocation(self):
        return self._endLocation

    @property
    def journeyDistance(self):
        return self._journeyDistance

    @property
    def startTime(self):
        return self._startTime

    @property
    def endTime(self):
        return self._endTime

    @property
    def inputIndex(self):
        return self._inputIndex

    @inputIndex.setter
    def inputIndex(self, newIndex):
        self._inputIndex = newIndex

    @property
    def taken(self):
        return self._taken

    @taken.setter
    def taken(self, value):
        self._taken = value


class Car(object):
    def __init__(self,
                 ID,
                 location=[0, 0],
                 onRide=False,
                 rideList=[],
                 stepAvailable=0,
                 destination=[0, 0]):
        self._ID = ID
        self._location = location
        self._onRide = onRide
        self._rideList = []
        self._stepAvailable = stepAvailable
        self._destination = destination

    @property
    def ID(self):
        return self._ID

    @property
    def location(self):
        return self._location

    @location.setter
    def location(self, newLocation):
        self._location = newLocation

    @property
    def onRide(self):
        return self._onRide

    @onRide.setter
    def onRide(self, isOnRide):
        self._onRide = isOnRide

    @property
    def rideList(self):
        return self._rideList

    @rideList.setter
    def rideList(self, newRideList):
        self._rideList = newRideList

    @property
    def stepAvailable(self):
        return self._stepAvailable

    @stepAvailable.setter
    def stepAvailable(self, newStepAvailable):
        self._stepAvailable = newStepAvailable

    @property
    def destination(self):
        return self._destination

    @destination.setter
    def destination(self, newDestination):
        self._destination = newDestination


def runOn(infile):

#    finished = False

    # Parse input into array
    with open(infile+'.in', 'r') as f:
        inp = [[int(n) for n in line.strip().split()] for line in f]

    rows, columns, fleetSize, rideNumber, bonus, steps = inp[0]
    inp = inp[1:]

    # Set up rides and cars
    rides = []
    for (i, ride) in enumerate(inp):
        startLocation = [ride[0], ride[1]]
        endLocation = [ride[2], ride[3]]
        startTime = ride[4]
        endTime = ride[5]
        inputIndex = i
        rides.append(Ride(startLocation, endLocation, startTime, endTime, inputIndex))
    fleet = [Car(ID=i) for i in xrange(fleetSize)]


    def selectRide(car, rides, currentStep):
        '''Returns index of best ride at current step'''

        bestRide = copy.deepcopy(rides[0])
#        bestRide = rides[0]
        newBestRide = False
        bestRide.distanceFromCar = calculateDistance(car.location, bestRide.startLocation)

        for ride in rides:
            distanceFromCar = calculateDistance(car.location, ride.startLocation)
            if (currentStep + distanceFromCar == ride.startTime):
                bestRide = ride
                bestRide.distanceFromCar = distanceFromCar
                newBestRide = True

        if newBestRide is False:
            for ride in rides:
                distanceFromCar = calculateDistance(car.location, ride.startLocation)
                if (currentStep + distanceFromCar <= ride.startTime):
                    bestRide = ride
                    bestRide.distanceFromCar = distanceFromCar
                    newBestRide = True
        return bestRide

    def getAvailableCars(fleet, currentStep):
        return filter(lambda car: car.stepAvailable == currentStep, fleet)

    def getAvailableRides(rides):
        return filter(lambda ride: ride.taken is False, rides)

    def init(rides, fleet):

        currentStep = 0

        for car in fleet:
            availableRides = getAvailableRides(rides)
            bestRide = selectRide(car, availableRides, currentStep)
            fleet[car.ID].rideList.append(bestRide.inputIndex)
            fleet[car.ID].onRide = True
            fleet[car.ID].destination = bestRide.endLocation
            fleet[car.ID].stepAvailable = currentStep + bestRide.journeyDistance
            rides[bestRide.inputIndex].taken = True
        return rides, fleet

    def step(currentStep, rides, fleet):
        availableCars = getAvailableCars(fleet, currentStep)

        def findAvailableRides(car, rides, fleet):
            availableRides = getAvailableRides(rides)
            if len(availableRides) == 0:
                # finished = True
                return "Finished"
            bestRide = selectRide(fleet[car.ID], availableRides, currentStep)
            fleet[car.ID].rideList.append(bestRide.inputIndex)
            fleet[car.ID].onRide = True
            fleet[car.ID].destination = bestRide.endLocation
            fleet[car.ID].location = bestRide.endLocation
            fleet[car.ID].stepAvailable = currentStep + bestRide.journeyDistance
            rides[bestRide.inputIndex].taken = True
            return rides, fleet

        for car in availableCars:
            try:
                rides, fleet = findAvailableRides(car, rides, fleet)
            except ValueError:
                #print "Finished step", currentStep
                pass
        try:
            return rides, fleet
        except Exception:
            pass

    rides, fleet = init(rides, fleet)
    for i in range(steps - 1):
        currentStep = i
        rides, fleet = step(currentStep, rides, fleet)

    with open('solution'+infile.upper()+'.txt', 'w') as f:
        for car in fleet:
            f.write(str(len(car.rideList)) + ' ' + ' '.join([str(x) for x in car.rideList]) + '\n')


for infile in infiles:
    print "Starting", infile, "..."
    runOn(infile)
    print "Finished", infile, ".\n"
