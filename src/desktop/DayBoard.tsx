import { List, ListItem, Block, Link } from 'framework7-react'
import type { Day } from '../data/types'
import { REGION } from '../data/style'
import { dayStart, mealOf } from '../data/timeline'
import { days, places, dateLong } from '../data/trip'

interface Props {
  day: Day
  onPick: (n: number | null) => void
  onSelect: (id: string) => void
}

/** Left panel for one day: the name, reminders, the key facts; notes and cost folded away */
export default function DayBoard({ day, onPick, onSelect }: Props) {
  const prev = days.find((d) => d.n === day.n - 1)
  const next = days.find((d) => d.n === day.n + 1)
  const region = REGION[day.region]
  const sleep = day.sleep ? places[day.sleep] : null
  const start = dayStart(day).time
  // The next morning, so the alarm time is visible the evening before
  const morning = next ? dayStart(next) : null
  const morningPlace = morning ? places[morning.stop.place] : null
  const morningMeal = morning ? mealOf(morning.stop) : null

  return (
    <>
      <header className="side-head" style={{ '--rc': region.color } as React.CSSProperties}>
        <div className="side-nav">
          <Link iconF7="chevron_left" onClick={() => onPick(prev ? prev.n : null)} tooltip={prev ? `Day ${prev.n}` : 'Whole trip'} />
          <span className="side-kicker num">
            <i className="rdot" /> Day {day.n} of {days.length} · {dateLong(day)} <span lang="ja">({day.weekday})</span>
          </span>
          <Link iconF7="chevron_right" onClick={() => next && onPick(next.n)} className={next ? '' : 'disabled'} />
        </div>
        <h1>{day.short}</h1>
        <p className="side-sub">{day.title}</p>
        <p className="side-ja" lang="ja">{day.titleJa}</p>
      </header>

      {day.alerts.length > 0 && (
        <div className="side-alerts">
          <h3>
            <i className="f7-icons">exclamationmark_triangle_fill</i> Don’t forget
          </h3>
          <ul>
            {day.alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <List inset strong dividers className="side-facts">
        <ListItem title="Start" after={start ?? 'n/a'}>
          <i slot="media" className="f7-icons">clock</i>
        </ListItem>
        <ListItem title="Weather" after={day.temp}>
          <i slot="media" className="f7-icons">thermometer_snowflake</i>
        </ListItem>
        {sleep ? (
          <ListItem link="#" onClick={() => onSelect(sleep.id)} title={sleep.en} header="Sleep" footer={morning ? `Day ${next!.n} starts ${morning.time ?? 'n/a'}${morningMeal ? `, ${morningMeal.toLowerCase()}` : ''}${morningPlace && morningPlace.id !== day.sleep ? ` · ${morningPlace.en}` : ' at the hotel'}` : undefined}>
            <i slot="media" className="f7-icons">moon_fill</i>
          </ListItem>
        ) : (
          <ListItem title="Flight home">
            <i slot="media" className="f7-icons">airplane</i>
          </ListItem>
        )}
      </List>

      {day.split && (
        <Block strong inset className="side-split">
          <b>Split day.</b> {day.split}
        </Block>
      )}

      <List inset strong accordionList className="side-more">
        <ListItem accordionItem title={`Day notes${day.notes?.length ? ` and ${day.notes.length} tips` : ''}`}>
          <div className="accordion-item-content">
            <Block>
              <p>{day.summary}</p>
              {day.notes && (
                <ul className="side-notes">
                  {day.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              )}
              {day.sleepNote && <p className="side-fine">Sleep: {day.sleepNote}</p>}
              {day.cost && (
                <p className="side-cost">
                  <span>Cost for the day, per person</span>
                  <b>{day.cost}</b>
                </p>
              )}
            </Block>
          </div>
        </ListItem>
      </List>
    </>
  )
}
