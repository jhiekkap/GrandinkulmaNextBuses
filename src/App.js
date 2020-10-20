import React, { useState } from 'react';
import './App.css';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'
import { useInterval } from './hooks'

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

const getTime = (date) => date.split(' ')[4]

function App() {

  const [nextBuses, setNextBuses] = useState([])

  const getNextBuses = async () => {
    const result = await client.query({ query: grandinKulmaQuery })
    const stopTimes = result.data.stops[0].stoptimesWithoutPatterns
    console.log(new Date(), 'STOP TIMES: ', stopTimes)
    setNextBuses(stopTimes)
  }

  useInterval(() => {
    getNextBuses()
  }, 2000)


  console.log('NEXT BUSES', nextBuses)



  return (
    <div className="App">
      {/* <button onClick={() => getNextBuses()}>HAE SEURAAVAT BUSSIT</button> */}
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
              Arvioitu tuloaika
            </td>
            <td>
              Tuloaika myöhässä
            </td>
            <td>
              Aikataulun mukainen lähtöaika
            </td>
            <td>
              Arvioitu lähtöaika
            </td>
            <td>
              Lähtöaika myöhässä
            </td>
          </tr>
        </thead>
        <tbody>
          {nextBuses.map((bus, i) => {
            const serviceDayInMs = bus.serviceDay * 1000
            //const localizedServiceDayInMs = serviceDayInMs //+ 3 * 60 * 60 * 1000
            //const localizedServiceDay1 = new Date(serviceDayInMs).toLocaleString('fi-FI')
            //const localizedServiceDay = new Date(localizedServiceDayInMs)
            //console.log('SERVICE DAY IN FINNISH TIME', localizedServiceDay, localizedServiceDay1)
            const scheduledArrival = getTime(new Date(serviceDayInMs + bus.scheduledArrival * 1000).toString())
            console.log('SCHEDULED ARRIVAL', scheduledArrival)
            const realtimeArrival = getTime(new Date(serviceDayInMs + bus.realtimeArrival * 1000).toString())
            console.log('REAL TIME ARRIVAL', realtimeArrival)
            const arrivalDelay = getTime(new Date(serviceDayInMs + bus.arrivalDelay * 1000).toString())
            console.log('ARRIVAL DELAY ', arrivalDelay)
            const scheduledDeparture = getTime(new Date(serviceDayInMs + bus.scheduledDeparture * 1000).toString())
            console.log('SCHEDULED DEPARTURE', scheduledDeparture)
            const realtimeDeparture = getTime(new Date(serviceDayInMs + bus.realtimeDeparture * 1000).toString())
            console.log('REAL TIME DEPARTURE', realtimeDeparture)
            const departureDelay = getTime(new Date(serviceDayInMs + bus.departureDelay * 1000).toString())
            console.log('DEPARTURE DELAY ', departureDelay)
              
            return <tr key={i}>
              <td>
                {bus.trip.routeShortName}
              </td>
              <td>
                {bus.trip.route.longName}
              </td>
              <td>
                {bus.trip.realtime ? 'KYLLÄ' : 'EI'}
              </td>
              <td>
                {scheduledArrival}
              </td>
              <td>
                {realtimeArrival}
              </td>
              <td>
                {arrivalDelay}
              </td>
              <td>
                {scheduledDeparture}
              </td>
              <td>
                {realtimeDeparture}
              </td>
              <td>
                {departureDelay}
              </td>
            </tr>
          })}
        </tbody>
      </table>

    </div>
  );
}

export default App;

