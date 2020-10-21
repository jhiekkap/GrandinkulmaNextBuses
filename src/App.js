import React, { useState, useEffect } from 'react';
import './App.css';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { useInterval } from './hooks';



export const grandinKulmaQuery = gql`
{
  stops(name: "Sörnäinen") {
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

  const [nextBuses, setNextBuses] = useState([]);

   useInterval(() => {
     getNextBuses()
   }, 2000)

  const getTime = (date) => date.split(' ')[4];
  const delayToString = (delay) => {
    const delayAbs = Math.abs(delay)
    let minutes = Math.floor(delayAbs / 60);
    //console.log('MINUTES', minutes)
    minutes = minutes === 0 ? '00' : (minutes < 10 ? '0' + minutes : minutes)
    let seconds = delayAbs < 10 ? '0' + delayAbs : delayAbs > 59 ? (delayAbs % 60 < 10 ? '0' + delayAbs % 60 : delayAbs % 60) : delayAbs
    return `${delay < 0 ? '+' : ''}${minutes}:${seconds}`
  }

  const getNextBuses = async () => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
      })
    });
    const result = await client.query({ query: grandinKulmaQuery })
    const stopTimes = result.data.stops[0].stoptimesWithoutPatterns
    setNextBuses(stopTimes)
    console.log(new Date(), 'STOP TIMES: ', stopTimes)
  }


  useEffect(() => {
    getNextBuses()
  }, [])

  const isRealTime = Boolean(nextBuses.find(bus => bus.realtime))

  //console.log('NEXT BUSES', nextBuses)
  //console.log('IS REAL TIME', isRealTime)

  return (
    <div className="App">
      {/* <button onClick={() => getNextBuses()}>Päivitä</button> */}
      <h2>Grandinkulman pysäkin (V6121) bussien tulo- ja lähtöajat</h2>
      {nextBuses.length > 0 && <h3>{`Pysäkillä ${isRealTime ? 'on ' : 'ei ole '} saatavilla reaaliaikai${isRealTime ? 'nen' : 'sta'} saapumistieto${!isRealTime ? 'a' : ''}`}</h3>}
      <table>
        <thead>
          <tr>
            <td>
              Linja
            </td>
            <td>
              Reitti
            </td>
            <td className="hideMobile">
              Reaaliaikainen saapumistieto
            </td>
            <td>
              Aikataulun mukainen tuloaika
            </td>
            {isRealTime && <td>
              Arvioitu tuloaika
            </td>}
            {isRealTime && <td>
              Tuloaika myöhässä
            </td>}
            <td>
              Aikataulun mukainen lähtöaika
            </td>
            {isRealTime && <td>
              Arvioitu lähtöaika
            </td>}
            {isRealTime && <td>
              Lähtöaika myöhässä
            </td>}
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
            //console.log('SCHEDULED ARRIVAL', scheduledArrival)
            const realtimeArrival = getTime(new Date(serviceDayInMs + bus.realtimeArrival * 1000).toString())
            //console.log('REAL TIME ARRIVAL', realtimeArrival)
            const arrivalDelay = delayToString(bus.arrivalDelay)
            //console.log('ARRIVAL DELAY ', arrivalDelay)
            const scheduledDeparture = getTime(new Date(serviceDayInMs + bus.scheduledDeparture * 1000).toString())
            //console.log('SCHEDULED DEPARTURE', scheduledDeparture)
            const realtimeDeparture = getTime(new Date(serviceDayInMs + bus.realtimeDeparture * 1000).toString())
            //console.log('REAL TIME DEPARTURE', realtimeDeparture)
            const departureDelay = delayToString(bus.departureDelay)
            //console.log('DEPARTURE DELAY ', departureDelay)

            return <tr key={i}>
              <td>
                {bus.trip.routeShortName}
              </td>
              <td>
                {bus.trip.route.longName}
              </td>
              <td className="hideMobile">
                {bus.realtime ? 'KYLLÄ' : 'EI'}
              </td>
              <td>
                {scheduledArrival}
              </td>
              {isRealTime && <td>
                {realtimeArrival}
              </td>}
              {isRealTime && <td>
                {arrivalDelay}
              </td>}
              <td>
                {scheduledDeparture}
              </td>
              {isRealTime && <td>
                {realtimeDeparture}
              </td>}
              {isRealTime && <td>
                {departureDelay}
              </td>}
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;

