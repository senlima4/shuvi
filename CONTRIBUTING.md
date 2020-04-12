# Contributing to Shuvi

Please take a moment to review this document in order to make the contribution process straightforward and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

## Core Ideas

Write less code, Let shuvi do more.

## Folder Structure

`shuvi` is a monorepo, meaning it is divided into independent sub-packages.<br>
These packages can be found in the [`packages/`](https://github.com/liximomo/shuvi/tree/master/packages) directory.

## Setting Up a Local Copy

1. Clone the repo with `git clone https://github.com/liximomo/shuvi`

2. Run `yarn` in the root folder.

3. Run `yarn build` in the root folder.

### Local Development

1. Open two ternimal at the root folder.

2. Run `yarn dev`

Once it is done, you can run shuvi cli by `yarn shuvi` in another terminal. It will serve the application in the specified dir.