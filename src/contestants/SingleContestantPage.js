import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const SingleContestantPage = ({ match }) => {
    const { contestantId } = match.params

    const contestant = useSelector(state =>
        state.contestants.find(contestant => contestant.id === contestantId)
    )

    if (!contestant) {
        return (
            <section>
                <h2>Contestant not found!</h2>
            </section>
        )
    }

    return (
        <section>
            <article className="contestant">
                <h2>{contestant.name}</h2>
                <p className="contestant-content">{contestant.job}</p>
                <Link to={`/editContestant/${contestant.id}`} className="button">
                    Edit Contestant
                </Link>
            </article>
        </section>
    )
}
