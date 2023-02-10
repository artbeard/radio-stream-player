import './style.css'
//Управление
const ctrlPlay: HTMLButtonElement = <HTMLButtonElement>document.getElementById('ctrlPlay');
const ctrlPause: HTMLButtonElement = <HTMLButtonElement>document.getElementById('ctrlPause');
const ctrlToggleBitrate: HTMLButtonElement = <HTMLButtonElement>document.getElementById('ctrlToggleBitrate');
//визульное отображение
const viewCurrentBitrate: HTMLElement = <HTMLElement>document.getElementById('viewCurrentBitrate');
const viewCurrentStatus: HTMLElement = <HTMLElement>document.getElementById('viewCurrentStatus');

ctrlPlay.addEventListener('click', ()=>{
	ctrlPlay.disabled = true;
	ctrlPause.disabled = false;
	ctrlToggleBitrate.disabled = false;
})

ctrlPause.addEventListener('click', ()=>{
	ctrlPlay.disabled = false;
	ctrlPause.disabled = true;
	ctrlToggleBitrate.disabled = true;
})

ctrlToggleBitrate.addEventListener('click', ()=>{
	
})
