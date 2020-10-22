import React, { useState, useEffect } from 'react';
import './App.css';
import { client, stopQuery } from './utils/graphQL'
import { useInterval } from './utils/hooks';
import TimeTable from './components/TimeTable';
import StopSearch from './components/StopSearch';

const App = () => {

  const [chosenStops, setChosenStops] = useState([])
  const [chosenStopName, setChosenStopName] = useState('Grandinkulma')

  useInterval(() => {
    getNextBuses()
  }, 10000)

  useEffect(() => {
    getNextBuses()
  }, [chosenStopName])

  const getNextBuses = async () => {
    try {
      const result = await client().query({ query: stopQuery(chosenStopName) })
      console.log('QUERY RESULT', result.data.stops) 
      setChosenStops(result.data.stops.map(stop => {
        const { name, code } = stop
        return {
          name,
          code,
          vehicles: stop.stoptimesWithoutPatterns.map(vehicle => {
            const { serviceDay, scheduledArrival, realtime, realtimeArrival, arrivalDelay,
              scheduledDeparture, realtimeDeparture, departureDelay, trip } = vehicle
            return {
              serviceDay,
              scheduledArrival,
              realtime,
              realtimeArrival,
              arrivalDelay,
              scheduledDeparture,
              realtimeDeparture,
              departureDelay,
              line: trip.routeShortName,
              route: trip.route.longName
            }
          }) 
        }
      }))
    } catch (error) {
      console.log('GRAPHQL ERROR', error)
    }
  }

  return (
    <div className="App">
      <h2>{`Haun ${chosenStopName}  tulo- ja lähtöajat`}</h2>
      <TimeTable chosenStops={chosenStops} />
      <StopSearch setChosenStopName={setChosenStopName} />
    </div>
  );
}

export default App;

