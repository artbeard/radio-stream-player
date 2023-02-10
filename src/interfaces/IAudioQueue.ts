export default interface IAudioQueue
{
	/**
	 * ДОбавить буфер в очередь
	 * @param item AudioBuffer
	 */
	enqueue(item: AudioBuffer): void
	/**
	 * Забрать буфер из очереди
	 * @return AudioBuffer | null
	 */
	dequeue(): AudioBuffer | null
	/**
	 * Количество буферов в очереди
	 * @return number
	 */
	getSize(): number
	/**
	 * Очистка очереди
	 */
	clearQueue(): void
}
