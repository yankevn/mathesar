import { get } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type { Action } from './types.d';

type CallbackFn = (e: Event) => void;
interface Options {
  callback: CallbackFn,
  references?: Readable<HTMLElement[]>,
}

export default function clickOffBounds(node: Element, options: Options): Action<Options> {
  let { callback, references } = options;

  function isWithinReferenceElement(event: Event) {
    if (!references) {
      return false;
    }
    return get(references).some(
      (reference) => reference.contains(event.target as Node),
    );
  }

  function outOfBoundsListener(event: Event) {
    if (!isWithinReferenceElement(event) && !node.contains(event.target as Node)) {
      callback(event);
    }
  }

  document.body.addEventListener('click', outOfBoundsListener, true);

  function update(opts: Options) {
    callback = opts.callback;
    references = opts.references;
  }

  function destroy() {
    document.body.removeEventListener('click', outOfBoundsListener, true);
  }

  return {
    update,
    destroy,
  };
}
