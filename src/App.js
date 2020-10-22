import React, { useState, useEffect } from 'react';
import './App.css';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { useInterval } from './hooks';
import { getTime, delayToString } from './utils';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


const stopQuery = (choseStopName) => gql`
{
  stops(name: "${choseStopName}") {
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


const App = () => {

  const [chosenStops, setChosenStops] = useState([])
  const [chosenStopName, setChosenStopName] = useState('Grandinkulma')

  useInterval(() => {
    getNextBuses()
  }, 5000)


  const getNextBuses = async () => {
    try {
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
          uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
        })
      });
      const result = await client.query({ query: stopQuery(chosenStopName) })
      console.log('QUERY RESULT', result.data.stops)
      setChosenStops(result.data.stops)
    } catch (error) {
      console.log('GRAPHQL ERROR', error)
      setChosenStopName('Grandinkulma')
      alert('Hakemaasi pysäkkiä ei löydy')
    }
  }


  useEffect(() => {
    getNextBuses()
  }, [chosenStopName])


  return (
    <div className="App">
      <h2>{`Pysäkin ${chosenStopName}  tulo- ja lähtöajat`}</h2>
      {chosenStops.map((stop, s) => {
        const isRealTime = Boolean(stop.stoptimesWithoutPatterns.find(stoptime => stoptime.realtime))

        return <div key={s} className='timetable'>
          {chosenStops.length === 2 && (s === 0 ? <ArrowForwardIcon /> : <ArrowBackIcon />)}
          <table >
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
              {stop.stoptimesWithoutPatterns.map((bus, i) => {
                const serviceDayInMs = bus.serviceDay * 1000
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
      })}

      <form onSubmit={e => {
        e.preventDefault()
        console.log('SUBMITTING', e.target.name.value)
        if (e.target.name.value) {
          setChosenStopName(e.target.name.value)
        }
      }}>
        <label>
          Kokeile toista pysäkkiä:
        <input type="text" name="name" />
        </label>
        <input type="submit" value="Lähetä" />
      </form>
    </div>
  );
}

export default App;

