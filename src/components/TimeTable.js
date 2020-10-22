import React from 'react';
import { getTime, delayToString } from './../utils';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const TimeTable = ({ chosenStops }) => {

    return <div>
        {chosenStops.map((stop, s) => {
            const isRealTime = Boolean(stop.vehicles.find(vehicle => vehicle.realtime))

            return <div className='timetable' key={s}>
                {chosenStops.length === 2 && (s === 0 ? <ArrowForwardIcon /> : <ArrowBackIcon />)}
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
                        {stop.vehicles.map((vehicle, i) => {
                            const serviceDayInMs = vehicle.serviceDay * 1000
                            const scheduledArrival = getTime(new Date(serviceDayInMs + vehicle.scheduledArrival * 1000).toString())
                            //console.log('SCHEDULED ARRIVAL', scheduledArrival)
                            const realtimeArrival = getTime(new Date(serviceDayInMs + vehicle.realtimeArrival * 1000).toString())
                            //console.log('REAL TIME ARRIVAL', realtimeArrival)
                            const arrivalDelay = delayToString(vehicle.arrivalDelay)
                            //console.log('ARRIVAL DELAY ', arrivalDelay)
                            const scheduledDeparture = getTime(new Date(serviceDayInMs + vehicle.scheduledDeparture * 1000).toString())
                            //console.log('SCHEDULED DEPARTURE', scheduledDeparture)
                            const realtimeDeparture = getTime(new Date(serviceDayInMs + vehicle.realtimeDeparture * 1000).toString())
                            //console.log('REAL TIME DEPARTURE', realtimeDeparture)
                            const departureDelay = delayToString(vehicle.departureDelay)
                            //console.log('DEPARTURE DELAY ', departureDelay)

                            return <tr key={i}>
                                <td>
                                    {vehicle.line}
                                </td>
                                <td>
                                    {vehicle.route}
                                </td>
                                <td className="hideMobile">
                                    {vehicle.realtime ? 'KYLLÄ' : 'EI'}
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
    </div>
}


export default TimeTable 