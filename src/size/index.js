import { device } from 'vigour-ua/navigator'

var width, height

if (device === 'phone') {
  // iphone 6 size
  width = 1334 / 2
  height = 750 / 2
} else if (device === 'desktop') {
  width = 1920
  height = 1080
}

global.innerWidth = width
global.innerHeight = height
