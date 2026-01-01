# Adam x Aliens

Adam is a lightweight reactive UI library that transforms native HTMLElements into reactive elements. Perfect for framework-agnostic applications and web component development.

```tsx
const externalSignal = signal("something")

function Component(): HTMLElement{
    const value = signal(0)
    return div()
        .style.color("green")
        .title("tooltip")(
            header("This is my header"),
            main("Second children")
            b(value),
            span(externalSignal)
        )
}
```
