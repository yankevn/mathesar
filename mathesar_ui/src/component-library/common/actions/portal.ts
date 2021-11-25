import type { Action } from './types.d';

export default function portal(
  node: Element,
  target?: HTMLElement,
): Action<HTMLElement | undefined> {
  const targetElement = target ?? document.querySelector('body') ?? undefined;

  function update(newTarget: HTMLElement | undefined) {
    if (newTarget && newTarget instanceof HTMLElement) {
      newTarget.appendChild(node);
    }
  }

  function destroy() {
    node.parentElement?.removeChild(node);
  }

  update(targetElement);

  return {
    update,
    destroy,
  };
}
