# TinyFaces 👦🏼👨🏾👩🏻 Figma Plugin

Fill layers in Figma with avatars & random data from [tinyfac.es](https://tinyfac.es/)...

**Features:**

-   📒 Fills text layers with random names
-   👦🏼 Fills shapes with random avatar stock photos
-   🎚 Choose between high quality or low quality images
-   💑 Filter to male, female or non-binary
-   👨‍👩‍👧‍👦 Supports components

**Installation/Usage:**

-   [Visit the Figma plugin page](https://www.figma.com/community/plugin/1009744160501872848)
-   Click Install
-   Select a few `text` and `shape (rectangle, ellipse, polygon, start, vector)` layers
-   Right click `Plugins` -> `TinyFaces` -> `Fill with high quality`
-   🎉🤩🥰


https://user-images.githubusercontent.com/980622/130806668-9dabd9e1-4aa0-4817-b0f4-52bfb5e72d07.mov


## Development

This template contains the react example as shown on [Figma Docs](https://www.figma.com/plugin-docs/intro/), with some structural changes and extra tooling.

-   Run `yarn` to install dependencies.
-   Run `yarn build:watch` to start webpack in watch mode.
-   Open `Figma` -> `Plugins` -> `Development` -> `New Plugin...` and choose `manifest.json` file from this repo.

⭐ To change the UI of your plugin (the react code), start editing [App.tsx](./src/app/components/App.tsx).  
⭐ To interact with the Figma API edit [controller.ts](./src/plugin/controller.ts).  
⭐ Read more on the [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/).

## Tooling

This repo is using:

-   React + Webpack
-   TypeScript
-   Prettier precommit hook
