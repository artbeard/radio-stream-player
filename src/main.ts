import './style.css'
import Player from './classes/Player';
//Управление
const ctrlPlay: HTMLButtonElement = <HTMLButtonElement>document.getElementById('ctrlPlay');
const ctrlPause: HTMLButtonElement = <HTMLButtonElement>document.getElementById('ctrlPause');
const ctrlToggleBitrate: HTMLButtonElement = <HTMLButtonElement>document.getElementById('ctrlToggleBitrate');
//визульное отображение
const viewCurrentBitrate: HTMLElement = <HTMLElement>document.getElementById('viewCurrentBitrate');
const viewCurrentStatus: HTMLElement = <HTMLElement>document.getElementById('viewCurrentStatus');

const player = new Player({
	high: 'http://bfmstream.bfm.ru:8004/fm64',
	low: 'http://bfmstream.bfm.ru:8004/fm32'
}, 3, function(data){viewCurrentStatus.innerText = data}, function(data){viewCurrentBitrate.innerText = data;})
ctrlPlay.addEventListener('click', ()=>{
	ctrlPlay.disabled = true;
	ctrlPause.disabled = false;
	ctrlToggleBitrate.disabled = false;
	player.play();
})

ctrlPause.addEventListener('click', ()=>{
	ctrlPlay.disabled = false;
	ctrlPause.disabled = true;
	ctrlToggleBitrate.disabled = true;
	player.pause();
})

ctrlToggleBitrate.addEventListener('click', ()=>{
	player.toggleBitrate();
})

