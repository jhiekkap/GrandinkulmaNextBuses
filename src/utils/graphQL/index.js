import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

export const client = () => new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    })
});

export const stopQuery = (choseStopName) => gql`
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