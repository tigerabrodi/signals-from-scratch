import { computed } from "./lib/computed.js";
import { effect } from "./lib/effect.js";
import { signal } from "./lib/signal.js";

const count = signal(0);
const name = signal("John");

const doubled = computed(() => {
  console.log("Computing `doubled`...");
  return count.get() * 2;
});

const greeting = computed(() => {
  console.log("Computing `greeting`...");
  return `Hello ${name.get()}, count is ${count.get()}`;
});

// Effects for UI updates
const countDisplay = document.createElement("div");
const nameInput = document.createElement("input");
const buttons = document.createElement("div");

document.body.append(countDisplay, nameInput, buttons);

// Effect for updating count display
effect(() => {
  console.log("Running `count` effect...");
  countDisplay.textContent = `Count: ${count.get()} (doubled: ${doubled()})`;
});

// Effect for name syncing
effect(() => {
  console.log("Running `name` effect...");
  nameInput.value = name.get();
});

// Add input handler
nameInput.addEventListener("input", (event) => {
  name.set(event.target.value);
});

// Add increment/decrement buttons
const incrementBtn = document.createElement("button");
incrementBtn.textContent = "+";
incrementBtn.onclick = () => count.set(count.get() + 1);

const decrementBtn = document.createElement("button");
decrementBtn.textContent = "-";
decrementBtn.onclick = () => count.set(count.get() - 1);

// Effect cleanup demo button
const cleanupBtn = document.createElement("button");
cleanupBtn.textContent = "Stop count effect";

const stopCount = effect(() => {
  const cleanup = () => console.log("Cleaning up count watcher...");
  console.log(`Count changed to: ${count.get()}`);
  return cleanup;
});

cleanupBtn.onclick = () => {
  stopCount();
  console.log("Stopped count watcher");
};

buttons.append(decrementBtn, incrementBtn, cleanupBtn);

// Log divider for console readability
console.log("App initialized" + "-".repeat(20));
