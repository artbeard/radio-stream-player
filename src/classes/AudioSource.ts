import IAudioSource from "../interfaces/IAudioSource";
interface IUrlSource{
	high: string,
	low: string
}
export default class AudioSource implements IAudioSource
{
	protected source: HTMLMediaElement;
	protected src: IUrlSource

	constructor(
		src: IUrlSource,
		waitDataCallback: (event?: Event) => void,
		readyCallback: (event?: Event) => void,
		toggleBitrateCallback: null | ((currentBitrate: any) => void)
		)
	{
		this.src = src;
		this.waitDataCallback = waitDataCallback;
		this.readyCallback = readyCallback;
		if (toggleBitrateCallback) this.toggleBitrateCallback = toggleBitrateCallback;
		this.source = new Audio();
		this.source.crossOrigin = 'anonymous';

		this.source.addEventListener('canplay', (event) => {
			this.waitDataCallback(event);
		});
		this.source.addEventListener('waiting', (event) => {
			this.readyCallback(event);
		});
	}
	
	/**
	 * Указывает на текущий битрейт
	 */
	protected currentBitrate: keyof IUrlSource = 'high';

	play(){
		this.source.src = this.src[this.currentBitrate];
		this.source.play();
	}
	pause(){
		this.source.pause();
	}
	
	/**
	 * Останавливаем, переключаем битрейт, запускаем заново
	 */
	toggleBitrate(){
		this.pause();
		this.currentBitrate = this.currentBitrate == 'high'
			? 'low'
			: 'high';
		this.source.src = this.src[this.currentBitrate];
		this.play();
		this.toggleBitrateCallback(this.currentBitrate);
	}
	
	createAudioNode(audioContex: AudioContext){
		return audioContex.createMediaElementSource(this.source);
	}

	//События
	waitDataCallback = function(event?: Event){ console.log('No data, wait...', event); }
	readyCallback = function(event?: Event){ console.log('Ready to play!', event); }
	toggleBitrateCallback = function(currentBitrate: any){ console.log('Current bitrate now:', currentBitrate); }
}