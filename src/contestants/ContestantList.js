import React from 'react'
import { useSelector } from 'react-redux'

export const ContestantList = () => {
    const contestants = useSelector(state => state.contestants)

    const renderedContestants = contestants.map(contestant => (
        <article className="post-excerpt" key={contestant.id}>
            <h3>{contestant.name}</h3>
            <p>{contestant.job.substring(0, 100)}</p>
        </article>
    ))

    return (
        <section>
            <h2>Contestants List</h2>
            {renderedContestants}
        </section>
    )
}
