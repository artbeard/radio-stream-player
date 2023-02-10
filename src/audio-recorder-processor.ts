//предварительно скопилировать и перенести в public
//tsc ./src/audio-recorder-processor.ts -t ESNext
class AudioRecorderProcessor extends AudioWorkletProcessor {

	protected simpleRate: number;
	protected duration: number;
	protected countFrames: number;

	constructor(params: any)
	{
		super();
		this.simpleRate = params.processorOptions.sampleRate;
		this.duration = params.processorOptions.duration
		this.countFrames =  this.duration * this.simpleRate;
	}

	soundBuffer:Float32Array[] = [];
	bufferLength:number = 0;
	protected __flushBuffer()
	{
		this.port.postMessage({
			buff: this.soundBuffer
		})
		this.soundBuffer = [];
		this.bufferLength = 0;
	}

	process(inputList: any[], outputList: any[]) {
		const sourceLimit = Math.min(inputList.length, outputList.length);
		//Перебираем все входы
		for (let inputNum = 0; inputNum < sourceLimit; inputNum++) {
			const input = inputList[inputNum];
			const output = outputList[inputNum];
			const channelCount = Math.min(input.length, output.length);
			//Перебираем все каналы
			for (let channelNum = 0; channelNum < channelCount; channelNum++) {
				//Если канала в буфере нет, создаем его
				if (this.soundBuffer[channelNum] == undefined) {
					this.soundBuffer[channelNum] = new Float32Array(this.countFrames);
				}
				input[channelNum].forEach((sample: number) => {
					// Передаем на выход
					//output[channelNum][i] = sample;
					if (this.bufferLength < this.countFrames) {
						this.soundBuffer[channelNum][this.bufferLength] = sample;
						this.bufferLength++;
					}
				});
			}
		}
		//При заполнении буфера, сбрасываем его 
		if (this.bufferLength == this.countFrames)
		{
			this.__flushBuffer()	
		}
		return true;
	}
}
registerProcessor('audio-recorder-processor', AudioRecorderProcessor)

export default AudioRecorderProcessor;
