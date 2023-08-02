<p align="center"><img src=".erb/img/mhk-logo.png" width="70%" /></p>

<br>

<p>
  Automaited offline challenge using <a href="https://electron.atom.io/">Electron</a>, <a href="https://facebook.github.io/react/">React</a>, <a href="https://github.com/reactjs/react-router">React Router</a>, <a href="https://webpack.js.org/">Webpack</a> and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
</p>

<br>

## Development

Install dependencies and start the app in the `dev` environment:


```bash
npm install
npm start
```

## Packaging for Production

To package for the local platform:

```bash
npm run package
```
## Features

- CRUD snippet
- Snippet look-up using title/description
- Autosave 5 seconds after changes

## Notes

- It is far from perfect:
  - No warning when leaving a widget without saving.
  - No warning when deleting.
  - <s>The external package that handles highlighting is meh.</s>
  - <s>It only highlights Javascript, for now, the functionality for changing it is there, just not the highlighting integration.</s>
  - <s>The nicer highlighter didn't have an edit while highlighting functionality, I could have used the best of both worlds but this already took too long.</s>
  
  <br/>
 
- Difficulties
  - Nothing to note technically speaking.
  - The timeframe set for this challenge is somewhat tight.

## Maintainer

- [Elhasan Ibrahim](https://github.com/mhkaserz)

## License

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)
