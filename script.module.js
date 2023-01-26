import {
  availableTimesForBackground,
  conflictingEventsData as oneWeekEventData,
} from "./data.module.js";

const backgroundPadElem = document.querySelector(".backgroundPad");
const eventDayContainer = document.querySelector(".eventDayContainer");

// functions defintions start
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

function getTopPixelsForTime(timeString) {
  let [hour, minute] = timeString.split(":");
  hour = Number(hour);
  minute = Number(minute);
  const totalMinutes = hour * 60 + minute;
  return totalMinutes;
}

function getEventsStartAndEndTimeMappingInPixels(events) {
  const mapping = [];
  events.forEach((event) => {
    const obj = {
      startTime: getTopPixelsForTime(event.startTime),
      endTime: getTopPixelsForTime(event.endTime),
      id: event.id,
      isAllowedForConflict: true,
    };
    mapping.push(obj);
  });
  return mapping;
}

const disableCurrentEventMapping = (mappingInPixels, event) => {
  const currEventMappedIndex = mappingInPixels.findIndex(
    (obj) => obj.id === event.id
  );
  mappingInPixels[currEventMappedIndex].isAllowedForConflict = false;
};

const getConflictingEventInfo = (mapping, eventToCheck) => {
  let conflictingEventCount = 0;
  mapping.forEach((entry) => {
    if (
      entry.id !== eventToCheck.id &&
      entry.isAllowedForConflict &&
      getTopPixelsForTime(eventToCheck.startTime) < entry.endTime &&
      getTopPixelsForTime(eventToCheck.endTime) > entry.startTime
    ) {
      conflictingEventCount++;
    }
  });

  return {
    isConflicting: conflictingEventCount > 0,
    conflictingEventCount,
  };
};

const createSingleEventElement = (mapping, eventsData, fragment) => {
  const currEventMap = mapping.find((obj) => obj.id === eventsData.id);
  const height =
    currEventMap.endTime - currEventMap.startTime > 0
      ? `${currEventMap.endTime - currEventMap.startTime}px`
      : "100%";

  const EventdivElem = document.createElement("div");
  EventdivElem.style.top = `${currEventMap.startTime}px`;
  EventdivElem.style.height = height;
  EventdivElem.textContent = eventsData.title;
  EventdivElem.style.backgroundColor = `${eventsData.color}`;
  EventdivElem.classList.add("singleEvent");

  const eventConflictInfo = getConflictingEventInfo(mapping, eventsData);
  if (eventConflictInfo.isConflicting) {
    EventdivElem.style.left = `${
      eventConflictInfo.conflictingEventCount * 20
    }px`;
    EventdivElem.style.width = `calc(100% - ${
      eventConflictInfo.conflictingEventCount * 20
    }px)`;
    EventdivElem.style.zIndex = `${
      eventConflictInfo.conflictingEventCount * 20
    }`;
  }
  disableCurrentEventMapping(mapping, eventsData);
  fragment.appendChild(EventdivElem);
};

const getSingleDayEventContainerElement = (totalDays) => {
  const divElem = document.createElement("div");
  divElem.style.width = `calc(80% / ${totalDays})`;
  divElem.classList.add("eventsContainer");
  return divElem;
};

// functions defintions end

createBackgroundTimes(availableTimesForBackground);

oneWeekEventData.forEach((SingleDayEvents) => {
  let mappingInPixels = [];
  const singleDayFragment = document.createDocumentFragment();
  if (SingleDayEvents.length > 0) {
    mappingInPixels = getEventsStartAndEndTimeMappingInPixels(SingleDayEvents);
    SingleDayEvents.forEach((eventInfo) => {
      createSingleEventElement(mappingInPixels, eventInfo, singleDayFragment);
    });
  }

  const dayEventContainerElement = getSingleDayEventContainerElement(
    oneWeekEventData.length
  );
  dayEventContainerElement.appendChild(singleDayFragment);
  eventDayContainer.appendChild(dayEventContainerElement);
});
