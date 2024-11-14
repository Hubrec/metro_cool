# metro_cool

A school project that implements a Paris Subway view with Vue 3, Vite and an Express.js API.

## Introduction

metro_cool is a web application that visualizes the Paris Subway system. Users can interact with the map to find the shortest path between two stations, view a covering tree of the network, and toggle station names for a clearer view. The application is built using Vue 3 for the frontend and Express.js for the backend API.

## Technologies Used

- Vue 3
- Vite
- Express.js
- JavaScript
- npm

## Dataset

The dataset provided had some missing lines on the pospoints.txt file. I've added the missing lines manually.
The points I added are:
- Bercy (740, 760)
- Pyramides (417, 504)

## Features

- Display the Paris Subway map
- Select two stations (with Ctlr + click) to calculate the shortest path between them
- Display a covering tree of the subway network
- Toggle the stating names visibility to tighten the view
- Zoom in and out with the mouse wheel to see more detail about the map and stations

## Project hosting

The app is hosted and available on [metrocool.mathisguerin.fr](http://metrocool.mathisguerin.fr).


## Project Setup and Run

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run the Express.js API

Go check the [Metro Cool API](https://github.com/Hubrec/metro_cool_api) for more information.
