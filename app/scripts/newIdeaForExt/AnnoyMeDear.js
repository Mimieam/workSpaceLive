
// // https://stackoverflow.com/questions/55458452/browser-based-session-timer
// //
// // atch for a specific targetUrl to be open

// // then every n minutes:
// //   query for the tab url
// //   bring it focus
// //   inject some css strobe effect to the page body


const playAlarmSound = (url)=>{
    let audio = new Audio(url||'http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3')
    audio.loop = true
    audio.play()
    return audio
}

export class Timer{
    constructor() {
        this._timer = null
        this._start_date = new Date()
        this._repeat_count = 0
        this._running = false
    }
    getElapsedTime(){
        return `${(new Date() - this._start_date)/1000}Sec`
    }
    getStats(){
        console.log(`
         Start Time: ${this._start_date},
         Elasped Time: ${(new Date() - this._start_date)/1000}Sec
         Running: ${this._running},
         Repeat Count: ${this._repeat_count + 1}X
        `)
        return this
    }

    startTimer({startFnAfterXms=1000, repeat=false, fn=()=>{}}){
        let time = startFnAfterXms

        this._running = true
        this._timer = setTimeout(function timerFn(_this){
           _this._repeat_count += 1
           // Function.prototype.bind.call(fn)(_this)
           fn(_this)
           _this._timer = repeat ? setTimeout(timerFn, time, _this) : _this._timer
        }, time, this) // passing this (Timer class) to the timerFn so we keep track of the latest everytime
        // because we are not using fat arrow here and this inside timeFn would be pointing to Window and not the Timer class
        return this
    }

    stopTimer({ afterXms=0, fn=()=>{} }){
        setTimeout(() => {
            clearTimeout(this._timer)
            fn(this)
            this._running = false
            this._repeat_count = 0
        }, afterXms);
        return this
    }
}

let t = new Timer()
// t.startTimer({
//     repeat:true,
//     startFnAfterXms:100,
//     // fn:(timerInstance)=>{console.log(`nothing to do... ${timerInstance.getElapsedTime()}`)}
//     fn:()=>{console.log(`nothing to do... ${t.getElapsedTime()}`)}
// }).stopTimer({afterXms: 3000 }).getStats()



// startTimer = (time=1000, fn=()=>{console.log('nothing to do...')}) => {
//     let timer = setTimeout(function myTimer() {
//       fn();
//       timer = setTimeout(myTimer, time);
//     }, time);
//     return timer
// }

// stopTimer = (timerID) =>  {
//   // console.log('Cancelling');
//   clearTimeout(timerID);
// }, 1)


// const targetUrls = [
//     'https://stackoverflow.com',
//     'https://github.com'
// ]

// //   query for the tab url
// //   bring it focus
// //   inject some css strobe effect to the page body

const alertMe = (timer) =>{
    console.log(`nothing to do... ${timer.getElapsedTime()}`)
}

const onTimersEnd = (timer) =>{
     console.log(`Stopping timer, ${timer.getElapsedTime()} - Repeated ${timer._repeat_count + 1}X`);
 }
chrome.tabs.onUpdated.addListener(async function listener (tabId, info, tab) {
    if (info.status === 'complete' && targetUrls.some(target => tab.url) ) {
        console.log(`${tab.url} [ ${tabId}, ${tab.id} ] - loaded"`)

      // highlight the target tab
      chrome.tabs.highlight({windowId:tab.windowId, tabs: tab.index}, function(data) { console.log("DONE", data)})
      // bring the window forward and maximized
      chrome.windows.update(tab.windowId, {focused: true, state: "maximized"}, (w)=> console.log(w));


        t.startTimer({
            repeat:true,
            startFnAfterXms:10000,
            fn: alertMe
            // fn:(timerInstance)=>{console.log(`nothing to do... ${timerInstance.getElapsedTime()}`)}
            // fn:()=>{console.log(`nothing to do... ${t.getElapsedTime()}`)}
        }).stopTimer({
            afterXms: 3000,
            fn: onTimersEnd
        })
        // t.getStats()
    }
})
//
myCSS = `
    html, body {
     animation:strobe 200ms steps(1,end) 15;

    }

    @keyframes strobe {
      50% { background:black; color:white; }
    }

    a { color: mint; }

`
sheet = new CSSStyleSheet();
sheet.replaceSync(myCSS);

// Combine existing sheets with our new one:
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];


document.querySelector('body').animate({
  offset: [ 0, 0.5, 1 ],

  opacity: [ 1, 0, 1],
  background: ['black', 'black', 'black'],
  color: ['inherit', 'white', 'inherit'],
//   fontSize: ['inherit', '22px', 'inherit'],
  easing: [ 'ease-in', 'ease-out', 'ease-in'],
}, {
  // timing options
  duration: 1000,
  iterations: 5
})


myCSS = `
    .strobe  { animation:strobe 200ms 50;}
    @keyframes strobe {50% { background:black; color:white; opacity:1 }}
    a { color: green;}
`
sheet = new CSSStyleSheet();
sheet.replaceSync(myCSS);

// Combine existing sheets with our new one:
document.adoptedStyleSheets = document.adoptedStyleSheets.includes[sheet] ?
                              document.adoptedStyleSheets : [...document.adoptedStyleSheets, sheet]





const playSound = (async (url)=>{
    let audio = new Audio(url||'http://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3')
    // audio.loop = true
    await audio.play()
    await audio.play()
    return audio
})

// note alertSound.pause() will stop it before the end of the loops
let timer = null
let repeat = true
let delay = 30*1000

const targetUrls = ['https://stackoverflow.com']
const tabsWithTimer = []

const waitAndAlert = async (tabId)=>{
    chrome.tabs.get(tabId, (tab)=>{
        timer = setTimeout(async function timerFn(){
            let isATarget = targetUrls.some(target => (tab.url.toLowerCase() || '').includes(target.toLowerCase()))
            if (isATarget) {
                console.log(tabId, tab.url, tab.index)//,  tabId == tab.id)
                console.log(`Target found: ${tab.url} [ ${tabId}, ${tab.id} ]"`)
                // highlight the target tab
                await chrome.tabs.highlight({ windowId: tab.windowId, tabs: tab.index }, function(data) { console.log("DONE", data) })
                // bring the window forward and maximize it
                await chrome.windows.update(tab.windowId,ss { focused: true, state: "maximized" }, (w) => console.log(w));
                // inject our css in the tab document - only once
                await chrome.tabs.executeScript(tab.id, {
                    code: `
                        (() => {
                            let myCSS = "\
                                .strobe  { animation:strobe 200ms 20;} \
                                @keyframes strobe {50% { background:black; color:white; opacity:1 }}\
                                a { color: green;}\
                            "

                            // create a new style sheet
                            let sheet = new CSSStyleSheet()
                            sheet.replaceSync(myCSS)

                            // Combine existing sheets with our new one
                            document.adoptedStyleSheets = document.adoptedStyleSheets.includes[sheet] ?
                                                          document.adoptedStyleSheets : [...document.adoptedStyleSheets, sheet]
                            console.log("INJECTED SCRIPT???",sheet)
                        })()
                    `
                })

                audio = await playSound()
            }
            timer = repeat ? setTimeout(timerFn, delay) : timer
            }, delay)
    })
    console.log(timer, audio)
    return timer
}

// fires for newly created window
chrome.tabs.onUpdated.addListener(async function listener (tabId, info, tab) {
    // if (!tabsWithTimer.includes(tabId)){
    //     timer = await waitAndAlert(tabId)
    // }
    console.log(tabId)

})
// fires on tab change
chrome.tabs.onActivated.addListener(async function listener (info) {
    // if (!tabsWithTimer.includes(info.tabId)){
    //     timer = await waitAndAlert(info.tabId)
    // }
    console.log(info.tabId)
})

