import {startGame, getoldManNumber} from './functions.js'

// אירוע טעינת הדף
document.addEventListener('DOMContentLoaded', startGame);

//אירוע לחיצה על כפתור
document.querySelector('#btn').addEventListener('click', getoldManNumber);