import {
  init,
  attributesModule,
  classModule,
  propsModule,
  styleModule,
  datasetModule,
  eventListenersModule,
  h,
  VNode,
} from "snabbdom";

export function makeRenderer<State>(
  mountpoint: Element,
  view: (state: State, rerender: () => void) => VNode
): (state: State) => void {
  const patch = init([
    // Init patch function with chosen modules
    attributesModule,
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
    datasetModule,
  ]);

  let renderState: Element | VNode = mountpoint;

  return function render(state: State): void {
    const newRenderState = view(state, () => render(state));
    patch(renderState, newRenderState);
    renderState = newRenderState;
  };
}
