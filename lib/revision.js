let currentRevision = 0;

let currentlyRunningComputed = null;
let currentlyRunningEffect = null;

export function getCurrentRevision() {
  return currentRevision;
}

export function incrementRevision() {
  return ++currentRevision;
}

export function setCurrentComputed({ dependencies }) {
  const previous = currentlyRunningComputed;
  currentlyRunningComputed = { dependencies };
  return previous;
}

export function resetCurrentComputed(previous) {
  currentlyRunningComputed = previous;
}

export function setCurrentEffect({ dependencies, runEffect }) {
  const previous = currentlyRunningEffect;
  currentlyRunningEffect = { dependencies, runEffect };
  return previous;
}

export function resetCurrentEffect(previous) {
  currentlyRunningEffect = previous;
}

export { currentlyRunningComputed, currentlyRunningEffect };
