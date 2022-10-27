async function getData (eStart, eEnd) {

    try {
        const calendarId = configuration.calendarId
        const myKey = configuration.myKey

        let apiCall = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?showDeleted=false&timeMin=${eStart}&timeMax=${eEnd}&key=${myKey}`)

        let activeEvents = await apiCall.json()
        activeEvents = [...activeEvents.items]
        activeEvents = activeEvents.filter(event => event.status != 'cancelled').sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime))
        sortedEvents = groupDates(activeEvents)
        

        for (evt in sortedEvents) {
            let eventDate = new Date(evt)
            eventDate = `${eventDate.toLocaleString('default', { month: 'long' })} ${eventDate.getDate()}`
            console.log(eventDate)
            console.log(sortedEvents[evt])
            let innerList = ''
            for (subEvt in sortedEvents[evt]) {
                console.log(sortedEvents[evt][subEvt])
                let title = sortedEvents[evt][subEvt].summary
                let eventStart = new Date(sortedEvents[evt][subEvt].start.dateTime)
                let eventEnd = new Date(sortedEvents[evt][subEvt].end.dateTime)
                let eventStartTime = eventStart.toLocaleTimeString()
                let eventEndTime = eventEnd.toLocaleTimeString()
                innerList += `<li><p class="cardTitle">${title}</p>  <p class="eventTime">${eventStartTime} - ${eventEndTime}</p></li>`
            }
                
            document.getElementById('theBase').innerHTML += `<div style="height:${cardHeight}px;" class='scrollCard'><div class="grid1"><p class="eventDate">${eventDate}</p></div><div class="grid2"><ul class="eventList">${innerList}</ul></div></div>`

        }

        /*for (evnt in activeEvents) {
            let title = activeEvents[evnt].summary
            if(activeEvents[evnt].start.hasOwnProperty('dateTime')) {
                let eventStart = new Date(activeEvents[evnt].start.dateTime)
                let eventEnd = new Date(activeEvents[evnt].end.dateTime)
                let eventStartTime = eventStart.toLocaleTimeString()
                let eventEndTime = eventEnd.toLocaleTimeString()
                let eventMonth = eventStart.toLocaleString('default', { month: 'long' })
                let eventDay = eventStart.getDate()
                document.getElementById('theBase').innerHTML += `<div style="height:${cardHeight}px;" class='scrollCard'><p class="eventDate">${eventMonth} ${eventDay}</p><p class="cardTitle">${title}</p><p class="eventTime">${eventStartTime} - ${eventEndTime}</p></div>`
            }
            else {
                document.getElementById('theBase').innerHTML += `<div style="height:${cardHeight}px;" class='scrollCard'><p class="eventDate">${eventMonth} ${eventDay}</p><p class="cardTitle">${title}</p></div>`
    
            }
        }*/
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

