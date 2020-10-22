import React from 'react';

const StopSearch = ({ setChosenStopName }) => <form onSubmit={e => {
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

export default StopSearch