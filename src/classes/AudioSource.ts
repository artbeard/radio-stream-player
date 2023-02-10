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
		// this.waitDataCallback = waitDataCallback;
		// this.readyCallback = readyCallback;
		if (toggleBitrateCallback) this.toggleBitrateCallback = toggleBitrateCallback;
		this.source = new Audio();
		this.source.crossOrigin = 'anonymous';

		this.source.addEventListener('canplay', waitDataCallback);
		this.source.addEventListener('waiting', readyCallback);
	}
	
	/**
	 * Указывает на текущий битрейт
	 */
	protected currentBitrate: keyof IUrlSource = 'high';

	async play(){
		if (!this.source.src)
			this.source.src = this.src[this.currentBitrate];
		await this.source.play();
	}
	async pause(){
		await this.source.pause();
	}
	
	/**
	 * Останавливаем, переключаем битрейт, запускаем заново
	 */
	toggleBitrate(){
		this.pause()
			.then(()=>{
				this.currentBitrate = this.currentBitrate == 'high'
					? 'low'
					: 'high';
				this.source.src = this.src[this.currentBitrate];
				this.play();
				this.toggleBitrateCallback(this.currentBitrate);
			})
			.catch(e =>{
				console.log('Возникла проблема с переключением битрейта', e);
			});
	}
	
	createAudioNode(audioContex: AudioContext): AudioNode
	{
		return audioContex.createMediaElementSource(this.source);
	}

	getCurrentBitrate(): string
	{
		return this.currentBitrate;
	}

	//События
	waitDataCallback = function(event?: Event){ console.log('No data, wait...', event); }
	readyCallback = function(event?: Event){ console.log('Ready to play!', event); }
	toggleBitrateCallback = function(currentBitrate: any){ console.log('Current bitrate now:', currentBitrate); }
}