import { format, parse } from "date-fns";

export enum TimezoneOffset {
  "+03:00" = "Europe/Moscow",
  "+05:00" = "Asia/Yekaterinburg",
}

export const timezones = [
  {
    offset_localized: "+03:00",
    offset_name: "Europe/Moscow",
    offset_value: 300,
  },
  {
    offset_localized: "+05:00",
    offset_name: "Asia/Yekaterinburg",
    offset_value: 500,
  },
  // "+05:00" = "Asia/Yekaterinburg",
];

const formatDate = (
  date: string | number | Date,
  pattern?: string,
  timeZone?: TimezoneOffset
) => {
  let timestamp = 0;
  const defaultDate = date;
  try {
    if (!date) return null;
    // if (typeof date === "string") return date.replaceAll("-", ".");

    if (typeof date !== "number") {
      // timestamp = parse(date)?.getTime();
      timestamp = new Date(date).getTime();
    } else {
      timestamp = date;
    }

    const localTimezone = format(new Date(), "XXX") as TimezoneOffset;
    if (!timeZone) {
      timeZone = localTimezone;
    }
    if (timeZone) {
      return format(
        new Date(timestamp),
        // timeZone,
        pattern || "dd.MM.yyyy HH:mm"
      );
    }

    return date;
  } catch (error) {
    return typeof defaultDate === "string"
      ? `${new Date(defaultDate.replace(/-/g, "/")).toLocaleDateString(
          "ru-RU"
        )} ${new Date(defaultDate.replace(/-/g, "/")).toLocaleTimeString(
          "ru-RU",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}`
      : null;
    // return `${timestamp} t2 ${t2} d ${d} Не удалось отформатировать дату ${JSON.stringify(
    //   error,
    //   null,
    //   2
    // )}`;
  }
};
export default formatDate;
