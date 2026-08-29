# Demo sandbox

Open `/demo/` or `/?demo=1` for sample practice. It starts with a spoken French greeting, **Bonjour**, one selected transcript line, a three-second speaking gap, three repeats, and one completed practice entry.

The sample recording is `public/assets/french-bonjour-ccby25.oga`: **“Bonjour” by Arka Voltchek, CC BY 2.5**, downloaded from Wikimedia Commons on 2026-08-29. It is shipped with the app and cached for offline demo reloads.

Demo records use the browser database `demo:audio-gap-loop` and `demo:`-prefixed browser keys. The normal player uses `audio-gap-loop` and unprefixed keys. **Reset demo** clears and reseeds only the demo namespace. **Start for real** clears all demo keys and deletes the demo database before opening `/`.
