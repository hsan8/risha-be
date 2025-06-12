// If the above isn't working, try:
import * as moment from 'moment';

// Your function remains the same:
const prefix = 'E_TRC';
export function generateTrackId(): string {
  const utcTimestamp = moment.utc().unix();
  const suffix = String(Math.floor(Math.random() * 999)).padStart(3, '0');
  return `${prefix}_${utcTimestamp}_${suffix}`;
}
