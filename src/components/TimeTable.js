import React, { useState, useEffect } from 'react';
import { getTime, delayToString } from './../utils';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const TimeTable = ({ stop, isRealTime, hasTwoStops, index }) => {

    return <div className='timetable'>
        {hasTwoStops && (index === 0 ? <ArrowForwardIcon /> : <ArrowBackIcon />)}
        <div>{`${stop.name} ${stop.code}`}</div>
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
}

export default TimeTable 