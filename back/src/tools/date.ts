import { WorkingHour } from "../types/graphql";

export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
const weekdays: Weekday[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export type TimeRange = [string, string]; // ['11:00:00Z', '22:00:00Z']

export function datetime(date: Date) {
  return {
    gt() {

    }
  }
}

export function datetimeRange(from: Date, to?: Date | null) {
  return {
    intersect(wh: WorkingHour): Date | null {
      const dayFrom = from.getDay();
      const timeFrom = from.getHours() * 60 + from.getMinutes();
      const weekDay = weekdays[dayFrom];
      const workingHoursFromI = wh[weekDay];
      if (!workingHoursFromI) {
        return null;
      }
      const [workingTimeFrom, workingTimeTo] = workingHoursFromI;
      
      const [workingHoursFromHours, workingHoursFromMinutes] = workingTimeFrom.split(':').slice(0, 2).map(Number);
      const [workingHoursToHours, workingHoursToMinutes] = workingTimeTo.split(':').slice(0, 2).map(Number);
      const workingHoursFrom1 = workingHoursFromHours * 60 + workingHoursFromMinutes;
      const workingHoursTo1 = workingHoursToHours * 60 + workingHoursToMinutes;

      if (timeFrom < workingHoursFrom1) {
        return null;
      }
      if (timeFrom > workingHoursTo1) {
       return null;
      }
      if (to) {
        const dayTo = to.getDay();
        const timeTo = to.getHours() * 60 + to.getMinutes();
        if (to.getTime() - from.getTime() < 0 || to.getTime() - from.getTime() > 24 * 60 * 60 * 1000) {
          return null;
        }
        if (dayTo !== dayFrom) {
          if (workingHoursTo1 !== 24 * 60 - 1) {
            return null;
          }
          const workingHoursToI = wh[weekdays[dayTo]];
          if (!workingHoursToI) {
            return null;
          }
          const [workingTimeFrom, workingTimeTo] = workingHoursToI;
          const [workingHoursFromHours, workingHoursFromMinutes] = workingTimeFrom.split(':').slice(0, 2).map(Number);
          const [workingHoursToHours, workingHoursToMinutes] = workingTimeTo.split(':').slice(0, 2).map(Number);
          const workingHoursFrom2 = workingHoursFromHours * 60 + workingHoursFromMinutes;
          const workingHoursTo2 = workingHoursToHours * 60 + workingHoursToMinutes;

          if (workingHoursFrom2 !== 0) {
            return null;
          }
          if (timeTo > workingHoursTo2) {
            return null;
          }
        } else {
          if (timeTo < workingHoursFrom1) {
            return null;
          }
          if (timeTo > workingHoursTo1) {
            return null;
          }
        }
        return to;
      }
      return new Date(from.getTime() + (workingHoursTo1 - timeFrom) * 60 * 1000);
    }
  }
}