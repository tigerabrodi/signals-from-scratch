import {
  getCurrentRevision,
  resetCurrentComputed,
  setCurrentComputed,
} from "./revision.js";

function computed(fn) {
  // Track when computation last ran (using global revision)
  // Global revision serves as a "global clock"
  let lastRunAt = 0;
  let lastResult;
  // Signals this computed depends on
  let dependencies = [];

  const computation = () => {
    // Has something changed since last run?
    const hasAnyChangesOccurred = dependencies.some(
      (value) => value.getLastChanged() > lastRunAt
    );

    const hasNothingChanged =
      !hasAnyChangesOccurred && lastResult !== undefined;

    if (hasNothingChanged) {
      return lastResult;
    }

    // If something changed, we need to recompute
    // We clear old dependencies before running
    // Why?
    // An example would be getting a signal's value inside a conditional
    // If the condition is false, the signal's value is not needed
    // If becomes true (the next time computed runs), then we need it in our dependencies (a signal that's called INSIDE a condition block)
    dependencies = [];

    // Set up tracking context so .get() calls can register themselves
    // When running the signals get() method, it will add itself to dependencies
    // currentlyRunning's dependencies refer to this specific `dependencies` reference
    // That's why it works
    const previousRunning = setCurrentComputed({ dependencies: dependencies });

    try {
      // Run computation - any .get() calls will add
      // themselves to currentlyRunningComputed.dependencies automatically
      lastResult = fn();

      // Mark when we ran using global revision
      // This will not really change after the function run just to be clear
      // You don't really run signal's `set` method inside a computed function
      // computed are derived from signals
      lastRunAt = getCurrentRevision();
      return lastResult;
    } finally {
      // Restore previous tracking context
      // This always runs before the return or error thrown
      // That's how `finally` works
      resetCurrentComputed(previousRunning);
    }
  };

  return computation;
}

export { computed };
