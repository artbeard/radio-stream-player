import IUrlSource from "../interfaces/IUrlSource";
import AudioSource from "./AudioSource";
import AudioQueue from "./AudioQueue";
enum PlayerStatus{
	buffering,
	play,
	stop,
}
enum StreamStatus{
	wait,
	ready,
	stop
}
export default class Player
{
	protected audioSource: AudioSource | null = null;
	protected audioContext: AudioContext | null = null;
	protected audioQueue: AudioQueue | null = null;
	protected bufferDuration: number = 1;

	protected playerStatus: PlayerStatus = PlayerStatus.stop;
	protected streamStatus: StreamStatus = StreamStatus.stop;

	constructor(src: IUrlSource, bufferDuration: number, onChangeStatusCallback: (data: string) => void, onChangeBitrateCallback: (data: any) => void)
	{
		this.bufferDuration = bufferDuration;
		this.createAudioSource(src);
		this.onChangeStatus = onChangeStatusCallback;
		this.onChangeBitrateCallback = onChangeBitrateCallback;
		
	}
	/**
	 * Колбек для инедикации текущего статуса
	 * @param data 
	 */
	protected onChangeBitrateCallback(data: string){console.log(data)};
	/**
	 * Колбек для индикации изменения битрейта
	 * @param data 
	 */
	protected onChangeStatus(data: string){console.log(data)};

	//Фабрики
	protected createAudioSource(src: IUrlSource)
	{
		const dataReady = () => { this.dataReady() };
		const dataWait = () =>{ this.dataWait() };
		const togglegBitrate = (data: any) =>{ this.togglegBitrate(data) };
		this.audioSource = new AudioSource(src, dataReady, dataWait, togglegBitrate);
	}
	protected getAudioSource(): AudioSource
	{
		return <AudioSource>this.audioSource;
	}
	protected createQueue()
	{
		this.audioQueue = new AudioQueue();
	}
	protected getQueue(): AudioQueue
	{
		if (this.audioQueue === null)
			this.createQueue();
		return <AudioQueue>this.audioQueue;
	}
	protected createAudioContext()
	{
		this.audioContext = new AudioContext();
	}
	protected getAudioContext(): AudioContext
	{
		if (this.audioContext === null)
			this.createAudioContext()
		return <AudioContext>this.audioContext;
	}

	protected dataReady()
	{
		this.streamStatus = StreamStatus.ready;
		this.onChangeStatus('Загружено');
	}
	protected dataWait()
	{
		this.streamStatus = StreamStatus.wait;
		this.playerStatus = PlayerStatus.buffering
		this.onChangeStatus('Загружаем данные...');
	}
	protected togglegBitrate(bitrate: any)
	{
		console.log('Текущий битрейт:', bitrate)
		this.onChangeBitrateCallback(bitrate);
	}

	protected async readBuffer(buffer: Float32Array[])
	{
		if (this.playerStatus == PlayerStatus.stop)
		{
			this.getQueue().clearQueue();
			return;
		}
		if (this.streamStatus == StreamStatus.wait)
		{
			return;
		}
		
		let simpleRate: number = this.getAudioContext().sampleRate;
		const newAudioBufer = this.getAudioContext().createBuffer(buffer.length, this.bufferDuration * simpleRate, simpleRate);
		for (let channel = 0; channel < buffer.length; channel++)
		{
			const chanelBuffer = newAudioBufer.getChannelData(channel);
			for (let i = 0; i < (this.bufferDuration * simpleRate); i++) {
				chanelBuffer[i] = buffer[channel][i];
			}
		}
		this.getQueue().enqueue(newAudioBufer);
		if (this.playerStatus == PlayerStatus.buffering)
		{
			this.playerStatus = PlayerStatus.play;
			this.sheduler();
		}
	}

	protected bufferSource: AudioBufferSourceNode | null = null;
	protected async playBuffer(audioBuffer: AudioBuffer)
	{
		this.onChangeStatus('Проигрываем');
		this.bufferSource = this.getAudioContext().createBufferSource();
      this.bufferSource.buffer = audioBuffer;
      this.bufferSource.connect(this.getAudioContext().destination);
      this.bufferSource.start();
		this.bufferSource.onended = ()=>{ this.sheduler() };
	}

	played = false;
	protected sheduler(): void
	{
		if (this.playerStatus == PlayerStatus.stop) return;
		
		if (this.getQueue().getSize() > 0)
		{
			this.playBuffer(this.getQueue().dequeue() as AudioBuffer)
		}
		else if (this.getQueue().getSize() == 0 && this.streamStatus == StreamStatus.wait)
		{
			if (this.getAudioSource().getCurrentBitrate() == 'high')
			{
				console.log('Требуется переключение на более низкий битрейт');
				this.toggleBitrate();
			}
			else
			{
				this.onChangeStatus('Низкая скорость интернета');
			}
		}
	}

	protected async initialize()
	{
		if (this.audioContext !== null) return;
		const audioCtx = this.getAudioContext();
		const audioNodeSource = <AudioNode>this.audioSource?.createAudioNode(audioCtx);
		await audioCtx.audioWorklet.addModule('./audio-recorder-processor.js');
		//Создаем рекордер
		let recorderParams = {
			processorOptions: {
				sampleRate: audioCtx.sampleRate,
				duration: this.bufferDuration
		}};
		const recorder:AudioWorkletNode  = new AudioWorkletNode( audioCtx, 'audio-recorder-processor', recorderParams);
		recorder.port.onmessage = (e: MessageEvent) => {
			this.readBuffer(e.data.buff);
		};
		//Подключаем источник семплов к рекордеру
		audioNodeSource.connect(recorder);
	}
	

	//Управление проигрывателем
	async play(){
		await this.initialize();
		this.playerStatus = PlayerStatus.buffering;
		this.streamStatus = StreamStatus.wait;
		this.getAudioSource().play();
		this.togglegBitrate(this.getAudioSource().getCurrentBitrate())
		this.onChangeStatus('Буферизация...');
	}
	pause(){
		this.getAudioSource().pause();
		this.bufferSource?.stop();
		this.playerStatus = PlayerStatus.stop;
		this.streamStatus = StreamStatus.wait;
		this.togglegBitrate('');
		
		this.onChangeStatus('Остановлено');
	}
	async toggleBitrate(){
		this.onChangeStatus('Переключение битрейта...');
		this.getAudioSource().toggleBitrate();
	}

}