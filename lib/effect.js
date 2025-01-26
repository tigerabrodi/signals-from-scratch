import { resetCurrentEffect, setCurrentEffect } from "./revision.js";

export function effect(fn) {
  // Signals this effect depends on
  let dependencies = [];
  let cleanup = undefined;

  const runEffect = () => {
    if (cleanup) cleanup();

    dependencies = [];
    const previousRunning = setCurrentEffect({
      dependencies,
      runEffect,
    });

    try {
      // When running the effect
      // It returns a cleanup function
      // fn() contains the `get` calls
      cleanup = fn() || undefined;
    } finally {
      resetCurrentEffect(previousRunning);
    }
  };

  // When the effect is stopped, we need to clean up
  const dispose = () => {
    if (cleanup) cleanup();
    dependencies.forEach((signal) => signal.unsubscribe(runEffect));
  };

  // Initial run
  runEffect();
  return dispose;
}
