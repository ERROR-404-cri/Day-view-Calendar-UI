import { availableTimesForBackground } from "./data.module.js";

const backgroundPadElem = document.querySelector(".backgroundPad");

const createBackgroundTimes = (data) => {
  const fragment = document.createDocumentFragment();

  data.forEach((entry) => {
    const divTag = document.createElement("div");
    const timeSpanTag = document.createElement("span");
    const lineSegment = document.createElement("span");

    divTag.classList.add("backGroundLineContainer");
    timeSpanTag.classList.add("backGroundTime");
    lineSegment.classList.add("backGroundLineSegment");
    timeSpanTag.textContent = entry.time;

    divTag.appendChild(timeSpanTag);
    divTag.appendChild(lineSegment);
    fragment.appendChild(divTag);
  });
  backgroundPadElem.appendChild(fragment);
};

createBackgroundTimes(availableTimesForBackground);

// util for time

const getTopPixelsForTime = (timeString) => {
  let [hour, minute] = timeString.split(":");
  hour = Number(hour);
  minute = Number(minute);
  const totalMinutes = hour * 60 + minute;
  return totalMinutes;
};

const createEndTimeToStartTimeMapping = (events) => {
  const mapping = [];
  events.forEach((event) => {
    const obj = {
      startTime: getTopPixelsForTime(event.startTime),
      endTime: getTopPixelsForTime(event.endTime),
      id: event.id,
    };
    mapping.push(obj);
  });
};

const getConflictingEventInfo = (mapping, eventToCheck) => {
  let count = 0;
  mapping.forEach((entry) => {
    if (
      entry.id !== eventToCheck.id &&
      getTopPixelsForTime(eventToCheck.startTime) < entry.endTime &&
      getTopPixelsForTime(eventToCheck.endTime) > entry.startTime
    ) {
      count++;
    }
  });
  return { isConflict: count > 0, conflictCount: count };
};
