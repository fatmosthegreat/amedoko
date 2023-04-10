window.onload = function () {
    let ameId = 'UCyl1z3jo3XHR1riLFKG5UAg';  //Channel ID
    //Fetch arguments
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-APIKEY': 'a87d0698-e648-4d04-8e98-517b1416263b' },
        body: '{"sort":"newest", "lang":["en","ja"],"target":["stream"],"conditions":[],"vch":["' + ameId + '"],"org":["Hololive"],"comment":[],"paginated":true,"offset":0,"limit":6}'
    };

    fetch('https://holodex.net/api/v2/search/videoSearch', options)
        .then((response) => response.json())
        .then((data) => {
            let streamId = 0;
            let live = false;
            let vod = false;
            let isAme;

            while (!live) {
                if (data.items[streamId].status == "live") {
                    live = true;
                }
                else {
                    if (streamId < 5)
                        streamId++;
                    else
                        break;
                }
            }
            if (live) {
                document.getElementById('title').innerHTML = "AME IS HERE";
                document.getElementById("ame_img").src = "images/AmeHappy.png";
                document.getElementById("stream_title").innerHTML = "Stream Link:"
                var link = data.items[streamId].id
                var streamTitle = data.items[streamId].title
                document.getElementById("stream").innerHTML = '<a target="_blank" href="https://www.youtube.com/watch?v=' + link + '">' + streamTitle;
            }
            else {
                //Have to check which stream in the array is actually a stream and not an upcoming one
                //so I can display time since that moment
                //there probably is a smarter way to do this but this works so it's good enough for now
                streamId = 0;
                while (!vod) {
                    if (data.items[streamId].status != "upcoming") {
                        vod = true;
                    }
                    else {
                        if (streamId < 5)
                            streamId++;
                        else
                            break;
                    }
                }
                //Displays the countdown since last stream
                lastStreamDate = new Date(data.items[streamId].available_at);
                document.getElementById("stream_title").innerHTML = "Previous Stream:"
                var link = data.items[streamId].id
                var streamTitle = data.items[streamId].title
                document.getElementById("stream").innerHTML = '<a target="_blank" href="https://www.youtube.com/watch?v=' + link + '">' + streamTitle;
                
                document.getElementById("ame_img").src = "images/AmeSad.jpg";
                html_timer();
                timer(correct_time(lastStreamDate, data.items[streamId].duration));
            }
        })
}

function correct_time(old_date, str_dur) {
    hours = Math.floor(str_dur / 3600);
    str_dur %= 3600;
    minutes = Math.floor(str_dur / 60);
    seconds = str_dur % 60;

    //console.log(hours)
    //console.log(minutes)
    //console.log(seconds)

    old_date.setHours(old_date.getHours() + hours)
    old_date.setMinutes(old_date.getMinutes() + minutes)
    old_date.setSeconds(old_date.getSeconds() + seconds)

    return old_date;
}

function html_timer() {
    document.getElementById('countup1').innerHTML += '<span>It&#39;s been </span>'
    document.getElementById('countup1').innerHTML += '<strong><span id="days">00</span>'
    document.getElementById('countup1').innerHTML += '<strong><span> days </span>'
    document.getElementById('countup1').innerHTML += '<strong><span id="hours">00</span>'
    document.getElementById('countup1').innerHTML += '<strong><span> hours </span>'
    document.getElementById('countup1').innerHTML += '<strong><span id="minutes">00</span>'
    document.getElementById('countup1').innerHTML += '<strong><span> minutes </span>'
    document.getElementById('countup1').innerHTML += '<strong><span id="seconds">00</span>'
    document.getElementById('countup1').innerHTML += '<strong><span> seconds </span>'
    document.getElementById('countup1').innerHTML += '<span>since last stream</span>'
}

function timer(lastStreamDate) {
    // Set up a timer to update the countdown every second
    setInterval(function () {
        // Calculate the difference between the current time and the date and time of the last stream
        const timeDifference = Date.now() - lastStreamDate.getTime();

        // Calculate the number of days, hours, minutes, and seconds
        const secondsInADay = 60 * 60 * 1000 * 24;
        const secondsInAHour = 60 * 60 * 1000;
        const days = Math.floor(timeDifference / (secondsInADay) * 1);
        const hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
        const mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
        const secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);

        // Update the countdown elements on the page with the updated values
        document.getElementById('days').innerHTML = days;
        document.getElementById('hours').innerHTML = hours;
        document.getElementById('minutes').innerHTML = mins;
        document.getElementById('seconds').innerHTML = secs;
    }, 1000);
}
