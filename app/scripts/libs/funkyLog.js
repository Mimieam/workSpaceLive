slaslac
/*
 myCallingFunction2: 26 starting first call + 1
↠ myCallingFunction2: 27 starting first call + 2
↠ myCallingFunction: 21 starting second call + 1
↠ ↠ fn3: 16 starting third call + 1
↠ ↠ fn3: 17 starting third call + 1
↠ myCallingFunction: 23 starting second call + 2
[Finished in 1.6s]
 */

// // // // a better log system for chrome exts

// // 'use strict';

// // /**
// //  * What do we want?
// //  * LOGS !!!
// //  * WHEN DO WE WANT ?
// //  * NOW ??
// //  * HOW DO WE WANT IT ??
// //  * COLORFUL and CUSTOMIZABLE
// //  */

// const fnX = () => {
//   console.log("Start F")
//   return true
// }
// "logTime > "
// " - Step 1: [.....]"

// console.log()


// // // html, body {
// // //  animation:strobe 200ms steps(1,end) 15;

// // // }

// // // @keyframes strobe {
// // //   50% { background:black; color:white; }
// // // }


// // // console.log("[%d][%fname]: -> %{my}")
// // const interleave = ([x, ...xs], ys = []) => (x === undefined
// //   ? ys // base: no x
// //   : [x, ...interleave(ys, xs)]) // inductive: some x


// // class FunkyLog {
// //   // time = null

// //   constructor() {
// //     this.registered = []
// //   }

// //   _register(fn) {
// //     this.registered.push(fn)
// //     // any registered fn must take a string and return a string
// //   }

// //   _runRegistered(str) {
// //     let _str = str
// //     this.registered.map((fn) => {
// //       _str = fn(_str)
// //       // console.log(_str)
// //     })
// //     return _str
// //   }

// //   formatThisShit(str, ...styles) {
// //     const open_delimiter = '%{'
// //     const closing_delimiter = '}%'
// //     const styleCount = (str.match(/is/g) || []).length
// //     let [_styles] = styles
// //     if (_styles) {
// //       _styles.splice(styleCount)
// //     } else {
// //       _styles = []
// //     }
// //     // "" => reset style
// //     _styles = interleave(_styles, Array(styleCount).fill(''))
// //     const formatedStr = str.split(open_delimiter).join('%c')
// //       .split(closing_delimiter).join('%c')
// //     return [formatedStr, ..._styles]
// //   }

// //   log(...strs) {
// //     let _str = this._runRegistered(...strs)
// //     _str = this.formatThisShit(_str)
// //     // console.log(..._str)
// //     return Function.prototype.bind.call(console.log, console, ..._str)()
// //     // return _str
// //   }
// // }

// // const newConsole = new FunkyLog()
// // newConsole._register((str) => {
// //   // console.log('test', str)
// //   if (str.includes('[%d]')) {
// //     return str.replace('[%d]', (`${new Date()}`).split(' ')[4])
// //   }
// //   return str
// // })
// // newConsole.log('[%d]: test %{my}%')

// // // console.log(`%o %cyellow`, [1,2,3], 'background: yellow')
// // // console.log("%c%s %c= %c%s","background:orange", "Array[index0]", "background:inherit;", "background:yellow;font-style: italic;", "google.com")
// // // console.log("%c" + "message", "color:" + "inherit; font-size: 23px");

// // // console.log("%c{{%s}} %c= %c%s","background:orange", "Array[index0]", "all:unset;", "background:yellow;font-style: italic;", "google.com")

// // // console.log("")


// // // let style = [
// // //     {
// // //         style: ['background: yellow'],
// // //         entity: "helloworld"
// // //     }
// // // ]


// // // // https://developers.google.com/web/tools/chrome-devtools/console/console-write#styling_console_output_with_css
// // // /**
// // // %s    Formats the value as a string
// // // %i or %d    Formats the value as an integer
// // // %f    Formats the value as a floating point value
// // // %o    Formats the value as an expandable DOM element. As seen in the Elements panel
// // // %O    Formats the value as an expandable JavaScript object
// // // %c    Applies CSS style rules to the output string as specified by the second parameter
// // // */
// // // const buildStr = ( entity ) =>{
// // //     let type = typeof(entity)
// // //     console.log(type)


// // // }

// // // function _log2 (id, text, ...args) {
// // //     if (debugInfo) {
// // //       args = args || [];
// // //       console.log(id, (new Date() + '').split(' ')[4], text, ...args);
// // //     }
// // //   }

// // // let LOGFILE = __filename.split(__dirname+"/").pop();
// // // let ORGI = console.log
// // // let debugInfo = true

// // // export function log () {
// // //   if (debugInfo) {
// // //     // return ORGI.apply(console, [`[${LOGFILE}]:`, (new Date() + '').split(' ')[4], ...arguments]);
// // //     return ORGI.apply(console, [`[_log_]:`, (new Date() + '').split(' ')[4], ...arguments]);
// // //   }
// // // }

// // // let log2 = function() {
// // //     // Put your extension code here
// // //     var args = Array.prototype.slice.call(arguments);
// // //     args.unshift(console);
// // //     // console.log(arguments)
// // //     var context = "My Descriptive Logger Prefix:";
// // //     // return Function.prototype.bind.apply(console.log, context, args);
// // //     return Function.prototype.bind.call(console.log, context, args);
// // // }();

// // // // Note the extra () to call the original console.log
// // // log("Foo", {bar: 1}, [3,22]);

// // // let log3 = function() {
// // //     var context = "My Descriptive Logger Prefix:";
// // //     return Function.prototype.bind.call(console.log, console, context, ...arguments);
// // //     // return Function.prototype.bind.call(console.log, console, context);
// // // }();


// // // // _log = ((...arguments) => {
// // // //     let text = ...arguments
// // // //     // "[%ctest]: %cmessage, dsfsdf", "font-size:10px;" , "color:" + "inherit; font-size: 20px"
// // // //     return Function.prototype.bind.call(console.log, console, text)
// // // // })();_log('format','message', 'extra')

// // // __doublel = function(){
// // //     let [a, b, ...c ]= arguments
// // //     return console.log.apply(console, [`[_log_]:`, (new Date() + '').split(' ')[4], ...[a,b]]);
// // // }
// // // // console.log(style[0].style.join())

// // // log("hello", '%arg%')

// // // buildStr('hello')

// // // _log = ((...arguments) => {
// // //         var args = Array.prototype.slice.call(arguments);
// // //            args.unshift(console);

// // //     args = ['%chel%clow%c', 'color:red;', 'color:green', 'font-size:33px']
// // // //     let text = typeof(arguments)
// // //     // let text = ["%c[test]: %cmessage, %cdsfsdf", "font-size:5px;" , "color:inherit; font-size: 20px", "font-size:inherit;"]
// // //     // console.log(text)
// // //     // let _l = Function.prototype.bind.call(console.info, console, text)
// // //     // _l.apply(console, text, '22')
// // //     return Function.prototype.bind.call(console.log, console, ...args)
// // // })();_log('format','message', 'extra')


// // // Function.prototype.mimiCall = function(someOtherThis) {
// // //   someOtherThis = someOtherThis || global;
// // //   const uniqueID = '00X__MIEZAN_FN__CALL__'
// // //   someOtherThis[uniqueID] = this;
// // //   const args = [];

// // //   // arguments are saved in strings, using args
// // //   for (var i = 1, len = arguments.length; i < len; i++) {
// // //     args.push("arguments[" + i + "]");
// // //   }
// // //   console.log(args, someOtherThis[uniqueID])
// // //   // strings are reparsed into statements in the eval method
// // //   // Here args automatically calls the Array.toString() method.
// // //   var result = eval("someOtherThis[uniqueID](" + args + ")");
// // //   delete someOtherThis[uniqueID];
// // //   return result;
// // // };
// // // // https://blog.usejournal.com/implement-your-own-call-apply-and-bind-method-in-javascript-42cc85dba1b

// // // mimiCall = ((...arguments) => {
// // //     let [fnName, ..._arguments] = arguments
// // //     const args = [];
// // //     // arguments are saved in strings, using args
// // //     for (var i = 1, len = _arguments.length; i < len; i++) {
// // //         args.push("arguments[" + i + "]");
// // //     }
// // //     try{
// // //         return eval(`fnName(${args})`)
// // //     } catch (e){
// // //        e.message =  e.name == 'TypeError' ? e.message.split("fnName").join(`${fnName}`) : e.message
// // //        console.error(e)
// // //     }
// // // })("hello", "test",[1,2,3], "Crazy")


// // // Function.prototype._call = (...arguments) => {

// // //     const args = [];
// // //     // arguments are saved in strings, using args
// // //     for (var i = 1, len = arguments.length; i < len; i++) {
// // //         args.push("arguments[" + i + "]");
// // //     }
// // //     console.log(args)
// // //     return eval("console.log(" + args + ")")
// // // }
// // // // ("hello", "test",[1,2,3], "Crazy")

// // // console.log("this %{is}% my %{test}%".format(style1, style2))

// // // "this %{is}% my %{test}%".replace('%{', '%c')

// // // function format(fmt, ...args){
// // //     return fmt
// // //         .split("%%")
// // //         .reduce((aggregate, chunk, i) =>
// // //             aggregate + chunk + (args[i] || ""), "");
// // // }


// // // // formatStr , [style1, style2, style3]
// // // //
// // // // count = (" ".match(/is/g) || []).length
// // // // "this %{is}% my %{test}%".replace(/%{/g, '%c').replace(/}%/g, '%c')

// // // const interleave = ([ x, ...xs ], ys = []) =>
// // //   x === undefined
// // //     ? ys                             // base: no x
// // //     : [ x, ...interleave (ys, xs) ]  // inductive: some x


// // // const
// // //  formatThisShit = (str, ...styles) =>{
// // //     const open_delimiter = '%{'
// // //     const closing_delimiter = '}%'

// // //     let styleCount = (str.match(/is/g) || []).length

// // //     let [_styles] = styles
// // //     _styles.splice(styleCount)
// // //     // "" => reset style
// // //     _styles = interleave(_styles, Array(styleCount).fill(''))

// // //     console.log(_styles)
// // //     // "this %{is}% my %{test}%".replace(/%{/g, '%c').replace(/}%/g, '%c')
// // //     formatedStr = str.split(open_delimiter).join('%c')
// // //                      .split(closing_delimiter).join('%c')

// // //     console.log([formatedStr, ..._styles])

// // //     return [formatedStr, ..._styles]
// // // }
