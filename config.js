/*
*   configurable values for app
*   calendarId = Google Calendar ID obtained from calendar integration settings
*   myKey = Google API key obtained from google cloud console https://console.cloud.google.com/
*   cardHeight = height of each calendar card
*   transitionSpeed = How quickly the cards scroll
*   dateOffset = Number of days to obtain from calendar
*   resetTime = time of day in 24h clock to get new data from API
*/

let configuration = {
    calendarId: "wttest503@gmail.com",
    myKey: "AIzaSyAszRQd8o1G8zXgu45v5UyrXVTFKUwySRk",
    cardHeight: 200,
    transitionSpeed: .2,
    dateOffset: 30,
    resetTime: 4
}