import React, { useState } from 'react';
import './App.css';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  })
})

export const grandinKulmaQuery = gql`
{
  stops(name: "Grandinkulma") {
    gtfsId
    name
    code
    lat
    lon
     stoptimesWithoutPatterns {
      scheduledArrival
      realtimeArrival
      arrivalDelay
      scheduledDeparture
      realtimeDeparture
      departureDelay
      realtime
      realtimeState
      serviceDay
      headsign
      realtimeArrival
      trip{
        route{
          longName
        }
        tripShortName
        routeShortName
      } 
    }
  }
}
`

function App() {

  const [nextBuses, setNextBuses] = useState([])

  const getNextBuses = async () => {
    const result = await client.query({ query: grandinKulmaQuery })
    const stopTimes = result.data.stops[0].stoptimesWithoutPatterns
    console.log('STOP TIMES: ', stopTimes)
    setNextBuses(result.data.stops[0].stoptimesWithoutPatterns)
  }

  console.log('NEXT BUSES', nextBuses)

  return (
    <div className="App">
      <button onClick={() => getNextBuses()}>HAE SEURAAVAT BUSSIT</button>
      <table>
        <thead>
          <tr>
            <td>
              Linja
            </td>
            <td>
              Reitti
            </td>
            <td>
             Tosiaikainen
            </td>
            <td>
              Aikataulun mukainen tuloaika
            </td>
            <td>
              Aikataulun mukainen lähtöaika
            </td>
            <td>
              Arvioitu tuloaika
            </td>
            <td>
              Arvioitu lähtöaika
            </td>
          </tr>
        </thead>
        <tbody>
          {nextBuses.map((bus, i) => <tr key={i}>
            <td>
              {bus.trip.routeShortName}
            </td>
            <td>
              {bus.trip.route.longName}
            </td>
            <td>
              {bus.trip.realtime ? 'KYLLÄ' : 'EI'}
            </td>
          </tr>)}
        </tbody>
      </table>

    </div>
  );
}

export default App;

// new Date(1603054800000).toLocaleString('fi-FI')
// * 1000!

