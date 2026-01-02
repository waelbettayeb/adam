import { computed, signal } from "./signals";
type ReactiveValue<T> =
  | T
  | ReturnType<typeof signal<T>>
  | ReturnType<typeof computed<T>>;

type ReactiveArray<T extends any[]> = {
  [K in keyof T]: ReactiveValue<T[K]> | T[K];
};

/**
 * Filter keys that are writable (exclude readonly and getter-only).
 */
type WritableKeys<T> = {
  [K in keyof T]: (<U>() => U extends { [Q in K]: T[K] } ? 1 : 2) extends <
    U
  >() => U extends { readonly [Q in K]: T[K] } ? 1 : 2
    ? never
    : K;
}[keyof T];

/**
 * Helper to extract the argument type of the setter for a property K in T.
 */
// typescript doens't allow to extract setter argument types directly
// check: https://github.com/microsoft/TypeScript/issues/21759
type SetterArg<T, K extends PropertyKey> = T extends {
  set [P in K](v: infer V): void;
}
  ? V
  : undefined;

/**
 * Make an object callable for setting properties in a reactive way.
 * When a property is set it will return the root object for chaining.
 * if the property is called without arguments it will return the root object.
 * if the property is accessed and is an object, it will return a reactive version of that object.
 */
type ReactiveBuilder<R, T = R> = T extends (...args: infer U) => unknown
  ? (...value: ReactiveArray<U>) => ReactiveBuilder<R>
  : {
      (value?: ReactiveValue<T>): ReactiveBuilder<R>;
    } & (T extends object
      ? {
          [K in WritableKeys<T>]: ReactiveBuilder<R, T[K]>;
        }
      : {});

const obj = {
  id: "string",
  style: {
    backgroundColor: "string",
    padding: "string",
  },
};

interface Obj {
  valueA: boolean;
  readonly valueB: string;
  get value(): number;
  set value(v: string);
}

type K = SetterArg<Obj, "value">; // should be all writable keys of HTMLElement
const reactiveObject: ReactiveBuilder<HTMLElement> = null!;
reactiveObject
  .id("my-id")
  .style.backgroundColor("red")
  .style.padding("10px")
  .style("border: 1px solid black;") // should accept setting style as string not CSSObject
  .accessKeyLabel("label"); // READONLY should error

const reactiveStyle: ReactiveBuilder<{}, (typeof obj)["style"]> = null!;
