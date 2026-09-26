// Dumps the trip data as JSON so the Python helper scripts can read it
import { days, rawPlaces } from '../src/data/trip.ts'
process.stdout.write(JSON.stringify({ days, places: rawPlaces }))
