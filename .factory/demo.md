# Demo sandbox

Open `/demo/` or `/?demo=1` for the one-click sample. It seeds a two-second WAV dialogue titled **Bakery greeting**, three French transcript lines, the middle line selected, a three-second silent gap, three repetitions, and one completed practice entry.

Demo records use IndexedDB database `demo:audio-gap-loop` and `demo:`-prefixed localStorage keys. The normal player uses `audio-gap-loop` and unprefixed keys; demo code never reads or writes those values. **Reset demo** clears only the demo namespace and reseeds it. **Start for real** returns to `/`.
