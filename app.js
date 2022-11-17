async function getData (eStart, eEnd) {

    try {
        const calendarId = configuration.calendarId
        const myKey = configuration.myKey
        let apiCall = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?showDeleted=false&singleEvents=true&timeMin=${eStart}&timeMax=${eEnd}&key=${myKey}`)

        let activeEvents = await apiCall.json()
        activeEvents = [...activeEvents.items]
        activeEvents = activeEvents.filter(event => event.status != 'cancelled').sort((a, b) => {
            let dateA, dateB
            
            if (a.start.date) {
                dateA = new Date(a.start.date)
            }
            else {
                dateA = new Date(a.start.dateTime)
            }
            if (b.start.date) {
                dateB = new Date(b.start.date)
            }
            else {
                dateB = new Date(b.start.dateTime)
            }
            return dateA - dateB
        
        })
        sortedEvents = groupDates(activeEvents)
        document.getElementById('theBase').innerHTML = ''
        for (evt in sortedEvents) {
            let eventDate = new Date(`${evt}T00:00:00`)
            eventDateMonth = `${eventDate.toLocaleString('default', { month: 'long' })}`.toUpperCase()
            dateOrdinal = nth(eventDate.getDate())
            eventDateDay = `${eventDate.getDate()}`//<span class="ordinal">${dateOrdinal}<span>
            let innerList = ''
            let title, eventStart, eventEnd, eventStartTime, eventEndTime
            for (subEvt in sortedEvents[evt]) {
                if (sortedEvents[evt][subEvt].start.date) {
                    title = sortedEvents[evt][subEvt].summary
                    innerList += `<li class="theEvents"><p class="cardTitle">${title}</p></li>`
                } else {
                    title = sortedEvents[evt][subEvt].summary
                    eventStart = new Date(sortedEvents[evt][subEvt].start.dateTime)
                    eventEnd = new Date(sortedEvents[evt][subEvt].end.dateTime)
                    eventStartTime = eventStart.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                    eventEndTime = eventEnd.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                    innerList += `<li class="theEvents"><p class="cardTitle">${title}</p>  <p class="eventTime">${eventStartTime}</p></li>`
                }
            }
            
            document.getElementById('theBase').innerHTML += `<div style="height:${cardHeight}px;" class='scrollCard'><div class="dateSection"><p class="eventDate dayName">${eventDateDay}</p><p class="eventDate monthName">${eventDateMonth}</p></div><div class="listContainer"><ul class="eventList">${innerList}</ul></div></div>`

        }
        refreshAt(resetTime,0,0)

    } catch (error) {
        console.log(error)
        refreshAt(resetTime,0,0)
    }
}


function setToBottomAnim(time) {

    if (lastTime === undefined) {
        lastTime = time
    }
    const delta = time - lastTime

    parentDiv = document.querySelector('#theBase')
    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        parentDiv.style.MozTransform = `translateY(${translation}px)`
    } else {
        parentDiv.style.transform = `translateY(${translation}px)`
    }

    translation -= transitionSpeed * (delta * .1)
    
    if (translation < -cardHeight - 15) {
        translation = 0
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            parentDiv.style.MozTransform = `translateY(${translation}px)`
        } else {
            parentDiv.style.transform = `translateY(${translation}px)`
        }
        parentDiv.appendChild(parentDiv.firstElementChild)
    }
    lastTime = time
    window.requestAnimationFrame(setToBottomAnim)
    
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
}

function getDatesInRange(startDate, endDate) {
    const date = new Date(`${startDate}T00:00:00`);
    endDate = new Date(`${endDate}T00:00:00`)
    const dates = [];
    let currDate
    while (date < endDate) {
      currDate = new Date(date)
      let theDay = ''
      if (currDate.getDate().toString().length === 1) {
        theDay = '0' +currDate.getDate().toString()
      }
      else {
        theDay = currDate.getDate()
      }
      dates.push(`${currDate.getFullYear()}-${currDate.getMonth() + 1}-${theDay}`);
      
      date.setDate(date.getDate() + 1);
    }
    return dates;
}

function groupDates (a) {
    let groupedEvents = {}
    a.forEach((evt) => {
        let date, dateEnd, dateRange
        if (evt.start.dateTime) {
            date = evt.start.dateTime.split('T')[0]
            if (groupedEvents[date]) {
                groupedEvents[date].push(evt);
            } else {
                groupedEvents[date] = [evt];
            }
        } else {
            date = evt.start.date
            dateEnd = evt.end.date
            dateRange = getDatesInRange(date, dateEnd)
            dateRange.forEach((dte) => {
                if (groupedEvents[dte]) {
                    groupedEvents[dte].push(evt);
                } else {
                    groupedEvents[dte] = [evt];
                }
            })
        }
        
    })
    return groupedEvents
}

Date.prototype.addDays = function(days) {
    var nDate = new Date(this.valueOf());
    nDate.setDate(nDate.getDate() + days);
    return nDate;
}

function refreshAt(hours, minutes, seconds) {
    let now = new Date();
    let then = new Date();
    if(now.getHours() > hours ||
       (now.getHours() == hours && now.getMinutes() > minutes) ||
        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);
    let timeout = (then.getTime() - now.getTime());
    eventStart = eventStart.addDays(1)
    eventEnd = eventEnd.addDays(1)
    setTimeout(() => {getData(eventStart.toISOString(), eventEnd.toISOString())}, timeout);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      toggleFullScreen();
    }
}, false);

const nth = function(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
}

let translation = 0
let cardHeight = configuration.cardHeight

let lastTime
let transitionSpeed = configuration.transitionSpeed
let eventStart = new Date()
let eventEnd = new Date()
let dateOffset = configuration.dateOffset
let resetTime = configuration.resetTime

eventEnd.setDate(eventEnd.getDate() + dateOffset)
getData(eventStart.toISOString(), eventEnd.toISOString())
window.requestAnimationFrame(setToBottomAnim)

