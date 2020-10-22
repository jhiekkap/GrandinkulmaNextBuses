import React, { useState, useEffect } from 'react';
import './App.css';
import { client, stopQuery } from './utils/graphQL'
import { useInterval } from './utils/hooks';


import TimeTable from './components/TimeTable';

const App = () => {

  const [chosenStops, setChosenStops] = useState([])
  const [chosenStopName, setChosenStopName] = useState('Grandinkulma')

  useInterval(() => {
    getNextBuses()
  }, 10000)

  useEffect(() => {
    getNextBuses()
  }, [])

  const getNextBuses = async () => {
    try {
      const result = await client().query({ query: stopQuery(chosenStopName) })
      console.log('QUERY RESULT', result.data.stops)
      setChosenStops(result.data.stops)
    } catch (error) {
      console.log('GRAPHQL ERROR', error)
    }
  }

  return (
    <div className="App">
      <h2>{`Haun ${chosenStopName}  tulo- ja lähtöajat`}</h2>
      <TimeTable chosenStops={chosenStops} />
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

