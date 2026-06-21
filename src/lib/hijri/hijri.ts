import { HijriDateDisplay } from ".";
import { getFormattedHijriDate } from "../controllers/hijriDate"

export function getHijriDateDisplay(): HijriDateDisplay {
  return getFormattedHijriDate();
}
