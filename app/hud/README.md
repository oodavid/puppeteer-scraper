# Heads-up Display (HUD)

Renders a Heads-up Display with title, keyboard control, progress meter, urlStates, messages and errors.

Uses [terminal-kit](https://github.com/cronvel/terminal-kit/) for the heavy lifting.

Renders colors and styles with [terminal-kit Style Markup](https://github.com/cronvel/terminal-kit/blob/master/doc/low-level.md#style-markup).

## Example output

This is without styling, I've added line numbers for reference.

<pre>
 0  Crawling <strong>oodavid.com</strong>
 1  [CTRL+C] to exit, [UP] Increase Threads, [DOWN] Increase Threads, [p] Unpause
 2
 3  <strong>Progress [==================</strong>---------------------------------------------------<strong>] 26% [15022 / 61280]   1,068 / 47,326</strong>
 4  Started: <strong>21 Nov 20:38</strong> Completed: <strong>296</strong> Rate: <strong>5,530 / hour</strong> TTC: <strong>8 hours</strong>
 5
 6  Loading     <strong>http://domain.com/1</strong>
 7  Loading     <strong>http://domain.com/2</strong>
 8  Loading     <strong>http://domain.com/3</strong>
 9  Processing  <strong>http://domain.com/4</strong>
10  -------     http://----.--
11  Loading     <strong>http://domain.com/6</strong>
12  Processing  <strong>http://domain.com/7</strong>
13  Loading     <strong>http://domain.com/8</strong>
14  -------     http://----.--
15  Loading     <strong>http://domain.com/10</strong>
16  12 threads (4 threads are hidden)
17
18  <strong>Paused. Wait for threads to complete</strong>
19  <strong>./error.log - 20 new errors - latest: 2017/11/14 11:40:58</strong>
</pre>

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
hud.progress(15022, 61280);

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
