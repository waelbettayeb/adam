import { signal } from "./signals";
import { render, reactive } from "./core";

const value = signal(0);

const div = () => reactive(document.createElement("div"));
const el = div()
  .textContent(value)
  .style.backgroundColor("lightblue")
  .style.padding("20px");

const interval = setInterval(() => {
  console.log("incrementing", value());
  value(value() + 1);
}, 1000);

document.getElementById("app")?.appendChild(render(el));
