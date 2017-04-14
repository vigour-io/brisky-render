import { device, platform } from 'vigour-ua/navigator'

var width, height, ratio

if (device === 'phone') {
  // iphone 6 size
  height = 1334 / 2
  width = 750 / 2
  ratio = 2
} else if (device === 'desktop') {
  width = 1920
  height = 1080
  ratio = platform === 'mac' ? 2 : 1
} else {
  width = 1920
  height = 1080
  ratio = 1
}

global.devicePixelRatio = ratio
global.innerWidth = width
global.innerHeight = height
