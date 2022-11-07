async function getData (eStart, eEnd) {

    try {
        const calendarId = configuration.calendarId
        const myKey = configuration.myKey
        let apiCall = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?showDeleted=false&timeMin=${eStart}&timeMax=${eEnd}&key=${myKey}`)

        let activeEvents = await apiCall.json()
        activeEvents = [...activeEvents.items]
        activeEvents = activeEvents.filter(event => event.status != 'cancelled').sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))
        sortedEvents = groupDates(activeEvents)
        document.getElementById('theBase').innerHTML = ''
        for (evt in sortedEvents) {
            
            let eventDate = new Date(`${evt}T00:00:00`)
            eventDateMonth = `${eventDate.toLocaleString('default', { month: 'long' })}`
            dateOrdinal = nth(eventDate.getDate())
            eventDateDay = `${eventDate.getDate()}<span class="ordinal">${dateOrdinal}<span>`
            let innerList = ''
            for (subEvt in sortedEvents[evt]) {
                let title = sortedEvents[evt][subEvt].summary
                let eventStart = new Date(sortedEvents[evt][subEvt].start.dateTime)
                let eventEnd = new Date(sortedEvents[evt][subEvt].end.dateTime)
                let eventStartTime = eventStart.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                let eventEndTime = eventEnd.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                innerList += `<li class="theEvents"><p class="cardTitle">${title}</p>  <p class="eventTime">${eventStartTime}</p></li>`
            }
                
            document.getElementById('theBase').innerHTML += `<div style="height:${cardHeight}px;" class='scrollCard'><div class="dateSection"><p class="eventDate">${eventDateMonth}</p><p class="eventDate">${eventDateDay}</p></div><div><ul class="eventList">${innerList}</ul></div></div>`

        }
        refreshAt(resetTime,0,0)

    } catch (error) {
        console.log(error)
        refreshAt(resetTime,0,0)
    }
}

function setToBottom() {

    parentDiv = document.querySelector('#theBase')
    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
        parentDiv.style.MozTransform = `translateY(${translation}px)`
    } else {
        parentDiv.style.transform = `translateY(${translation}px)`
    }
    translation -= transitionSpeed
    
    if (translation < -cardHeight - 15) {
        translation = 0
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            parentDiv.style.MozTransform = `translateY(${translation}px)`
        } else {
            parentDiv.style.transform = `translateY(${translation}px)`

        }
        parentDiv.appendChild(parentDiv.firstElementChild)
    }
    
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
}

function groupDates (a) {
    let groupedEvents = {}
    a.forEach((evt) => {
        const date = evt.start.dateTime.split('T')[0]
        if (groupedEvents[date]) {
            groupedEvents[date].push(evt);
        } else {
            groupedEvents[date] = [evt];
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

let transitionSpeed = configuration.transitionSpeed
if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
    transitionSpeed *= 3.05
}
let eventStart = new Date()
let eventEnd = new Date()
let dateOffset = configuration.dateOffset
let resetTime = configuration.resetTime

eventEnd.setDate(eventEnd.getDate() + dateOffset)
getData(eventStart.toISOString(), eventEnd.toISOString())
setInterval(setToBottom,5)

