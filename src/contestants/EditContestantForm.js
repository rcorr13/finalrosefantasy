import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { contestantUpdated } from './contestantsSlice'

export const EditContestantForm = ({ match }) => {
    const { contestantId } = match.params

    const contestant = useSelector(state =>
        state.contestants.find(contestant => contestant.id === contestantId)
    )

    const [name, setName] = useState(contestant.name)
    const [job, setJob] = useState(contestant.job)

    const dispatch = useDispatch()
    const history = useHistory()

    const onNameChanged = e => setName(e.target.value)
    const onJobChanged = e => setJob(e.target.value)

    const onSaveContestantClicked = () => {
        if (name && job) {
            dispatch(contestantUpdated({ id: contestantId, name, job }))
            history.push(`/contestants/${contestantId}`)
            history.push(`/contestants`)
        }
    }

    return (
        <section>
            <h2>Edit Contestant</h2>
            <form>
                <label htmlFor="contestantName">Contestant Name:</label>
                <input
                    type="text"
                    id="contestantName"
                    name="contestantName"
                    placeholder="What's on your mind?"
                    value={name}
                    onChange={onNameChanged}
                />
                <label htmlFor="contestantJob">Job:</label>
                <textarea
                    id="contestantJob"
                    name="contestantJob"
                    value={job}
                    onChange={onJobChanged}
                />
            </form>
            <button type="button" onClick={onSaveContestantClicked}>
                Save Contestant
            </button>
        </section>
    )
}
