import {
  currentlyRunningComputed,
  currentlyRunningEffect,
  getCurrentRevision,
  incrementRevision,
} from "./revision.js";

export function signal(initialValue) {
  let value = initialValue;

  // We don't need subscriptions for computed because they run whenever they're called
  // Effects on the other hand is "reactive" whenever signals inside of them change
  // Using a Set to avoid duplicates
  const subscribedEffects = new Set();

  // When was this specific value last changed?
  let lastChanged = getCurrentRevision();

  return {
    get() {
      // Automatic dependency tracking
      // If we're inside a computation (memoize/effect)
      // add this value to its dependencies
      if (currentlyRunningComputed) {
        currentlyRunningComputed.dependencies.push(this);
      }

      if (currentlyRunningEffect) {
        currentlyRunningEffect.dependencies.push(this);
        subscribedEffects.add(currentlyRunningEffect.runEffect);
      }

      return value;
    },

    unsubscribe(effect) {
      subscribedEffects.delete(effect);
    },

    set(newValue) {
      value = newValue;
      // We only update the global revision when a signal is set
      // Otherwise, we know no changes have occurred
      incrementRevision();
      lastChanged = getCurrentRevision();

      // Run all subscribed effects
      subscribedEffects.forEach((runEffect) => runEffect());
    },

    getLastChanged() {
      return lastChanged;
    },
  };
}
