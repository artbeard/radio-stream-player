import IAudioQueue from "../interfaces/IAudioQueue";

export default class AudioQueue implements IAudioQueue{
	constructor(
		private queue: AudioBuffer[] = []
	)
	{}
	enqueue(item: AudioBuffer): void
	{
		this.queue.push(item);
	}
	dequeue(): AudioBuffer | null
	{
		return this.queue.shift() ?? null
	}
	getSize(): number
	{
		return this.queue.length
	}
	clearQueue(): void
	{
		this.queue = [];
	}
}
