<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import {
    faTimes,
  } from '@fortawesome/free-solid-svg-icons';
  import {
    Icon,
    Button,
    Select,
    TextInput,
  } from '@mathesar-component-library';
  import type { FilterEntry } from '@mathesar/stores/table-data/types';
  import type { SelectOption } from '@mathesar-component-library/types';

  const dispatch = createEventDispatcher();

  export let options: SelectOption[];
  export let conditions: SelectOption[];

  export let filterByDuplicates: boolean;

  export let column: FilterEntry['column'];
  export let condition: FilterEntry['condition'];
  export let value: FilterEntry['value'];

  let inputValue: string;
  let timer: number;

  onMount(() => {
    inputValue = value;
  });

  onDestroy(() => {
    window.clearTimeout(timer);
  });

  function onValueChange(_inputValue: string) {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (value !== _inputValue) {
        value = _inputValue;
        dispatch('reload');
      }
    }, 500);
  }
  
  $: onValueChange(inputValue);
</script>

<tr>
  <td class="column">
    <Select {options} bind:value={column}
      on:change={() => dispatch('reload')}/>
  </td>
  <td class="dir">
    <Select options={conditions} bind:value={condition}
      on:change={() => dispatch('reload')}/>
  </td>
  {#if !filterByDuplicates}
    <td class="value">
      <TextInput bind:value={inputValue}/>
    </td>
  {/if}
  <td>
    <Button size="small" on:click={() => dispatch('removeFilter')}>
      <Icon data={faTimes}/>
    </Button>
  </td>
</tr>
