export default interface IAudioSource{
	
	/**
	 * Создает и возвращает источник звука:
	 * 	элемент типа AudioNode
	 * @returns AudioNode
	 */
	createAudioNode: () => AudioNode;
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
	waitData: (event?: Event) => void;
	/**
	 * Событие, возникающее, когда есть данные для буферизации
	 * @param event 
	 */
	ready: (event?: Event) => void;
}