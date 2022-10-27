async function getData (eStart, eEnd) {

    try {
        const calendarId = configuration.calendarId
        const myKey = configuration.myKey

        let apiCall = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?showDeleted=false&timeMin=${eStart}&timeMax=${eEnd}&key=${myKey}`)

        let activeEvents = await apiCall.json()
        activeEvents = [...activeEvents.items]
        activeEvents = activeEvents.filter(event => event.status != 'cancelled').sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))
        for (evnt in activeEvents) {
            let title = activeEvents[evnt].summary
            if(activeEvents[evnt].start.hasOwnProperty('dateTime')) {
                let eventStart = new Date(activeEvents[evnt].start.dateTime)
                let eventEnd = new Date(activeEvents[evnt].end.dateTime)
                let eventStartTime = eventStart.toLocaleTimeString()
                let eventEndTime = eventEnd.toLocaleTimeString()
                document.getElementById('theBase').innerHTML += `<div style="height:${cardHeight}px;" class='scrollCard'><p class="eventDate">${(eventStart.getMonth() + 1)}-${eventStart.getDate()}-${eventStart.getFullYear()}</p><p class="cardTitle">${title}</p><p class="eventTime">${eventStartTime} - ${eventEndTime}</p></div>`
            }
            else {
                let eventStart = new Date(activeEvents[evnt].start.date)
                document.getElementById('theBase').innerHTML += `<div style="height:${cardHeight}px;" class='scrollCard'><p class="eventDate">${(eventStart.getMonth() + 1)}-${eventStart.getDate()}-${eventStart.getFullYear()}</p><p class="cardTitle">${title}</p></div>`
    
            }
        }
    } catch (error) {
        console.log(error)
    }
}

function setToBottom() {

    parentDiv = document.querySelector('#theBase')
    parentDiv.style.transform = `translateY(${translation}px)`
    translation -= transitionSpeed
    
    if (translation < -cardHeight - 15) {
        translation = 0
        parentDiv.style.transform = `translateY(${translation}px)`
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
    setTimeout(function() { window.location.reload(true); }, timeout);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      toggleFullScreen();
    }
}, false);

let translation = 0
let cardHeight = configuration.cardHeight
let transitionSpeed = configuration.transitionSpeed
let eventStart = new Date()
let eventEnd = new Date()
let dateOffset = configuration.dateOffset
let resetTime = configuration.resetTime

eventEnd.setDate(eventEnd.getDate() + dateOffset)
getData(eventStart.toISOString(), eventEnd.toISOString())
setInterval(setToBottom,5)
refreshAt(4,0,0)

