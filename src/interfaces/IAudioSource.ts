export default interface IAudioSource{
	
	/**
	 * Создает и возвращает источник звука:
	 * 	элемент типа AudioNode
	 * @returns AudioNode
	 */
	createAudioNode: (audioContex: AudioContext) => AudioNode;
	/**
	 * Запуск воспроизведения
	 */
	play: () => void;
	/**
	 * Остановка воспроизведения
	 */
	pause: () => void;
	/**
	 * Переключение битрейта
	 */
	toggleBitrate: () => void;

	//События
	/**
	 * Событие, возникающее, если нет данных для буферизации
	 * @param event 
	 */
	waitDataCallback: (event?: Event) => void;
	/**
	 * Событие, возникающее, когда есть данные для буферизации
	 * @param event 
	 */
	readyCallback:  (event?: Event) => void;
	/**
	 * Срабатывает, при переключении битрейта
	 * @param event 
	 */
	toggleBitrateCallback:  (currentBitrate: any, event?: Event) => void;
}