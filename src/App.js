import React from 'react';
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

  const getNextBuses = async () => {
    const result = await client.query({ query: grandinKulmaQuery })
    console.log('QUERY RESULT: ', result.data.stops[0].stoptimesWithoutPatterns)
  }

  return (
    <div className="App">
      <button onClick={() => getNextBuses()}>GET NEXT BUSES</button>
    </div>
  );
}

export default App;

// new Date(1603054800000).toLocaleString('fi-FI')
// * 1000!
/*
 