# Heads-up Display (HUD)

Renders a Heads-up Display with title, keyboard control, progress meter, urlStates, messages and errors.

Uses [terminal-kit](https://github.com/cronvel/terminal-kit/) for the heavy lifting.

Renders colors and styles with [terminal-kit Style Markup](https://github.com/cronvel/terminal-kit/blob/master/doc/low-level.md#style-markup).

## Example output

This is without styling, I've added line numbers for reference.

```
 0  Crawling oodavid.com
 1  [CTRL+C] to exit, [UP] Increase Threads, [DOWN] Increase Threads, [p] Unpause
 2
 3  Progress [==-------------------------------] 7.8% [1,502 / 19,104]
 4  Completed: 8, Rate: 1,689 / hour, TTC: 17 hours
 5
 6  Loading     http://domain.com/1
 7  Loading     http://domain.com/2
 8  Loading     http://domain.com/3
 9  Processing  http://domain.com/4
10  -------     http://----.--
11  Loading     http://domain.com/6
12  Processing  http://domain.com/7
13  Loading     http://domain.com/8
14  -------     http://----.--
15  Loading     http://domain.com/10
16  12 threads (4 threads are hidden)
17
18  Paused - processes will spin down
19  ./error.log - 20 new errors - latest: 2017/11/14 11:40:58
```

## Usage

```js
// line 0 - hud.title
hud.title('Crawling ^goodavid.com^:');

// line 1 - hud.keyboard
hud.keyboard.assign('UP', increaseProcesses, 'Increase Processes');
hud.keyboard.assign('DOWN', decreaseProcesses, 'Decrease Processes');
hud.keyboard.assign('p', pause, 'Pause');
hud.keyboard.start();
// ...can be reassigned
hud.keyboard.assign('p', unpause, 'Unpause');

// line 3-4 - hud.progress
hud.progress(1502, 19104);

// lines 6-16 - hud.urlState
for(var n=1;n<=20;n++){
  hud.urlState(`http://domain.com/${n}`, 'Loading');
}
hud.urlState(`http://domain.com/4`, 'Processing');
hud.urlState(`http://domain.com/5`, false);
hud.urlState(`http://domain.com/7`, 'Processing');
hud.urlState(`http://domain.com/9`, false);

// line 18 - hud.message
hud.message('Paused - processes will spin down');

// line 19 - hud.error
hud.error(new Error('Oh dear!'));
```
