import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

const useHistoryState = (initialState, key) => {
	const history = useRouter();
	const stateValue = history.location?.state?.[key];

	const [historyState, setHistoryState] = useState(stateValue === undefined ? initialState : stateValue);

	const setState = useCallback(
		(state, replace = false) => {
			const value = state instanceof Function ? state(historyState) : state;

			setHistoryState(() => value);

			if (replace) {
				history.replace({ state: value });
			} else if (key === 'page') {
				history.replace({
					state: { ...(history?.location?.state ? history.location.state : ''), [key]: value },
				});
			}
		},
		[history, historyState, key]
	);

	return [historyState, setState];
};

export default useHistoryState;
