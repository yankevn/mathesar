<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import {
    faFilter,
    faSort,
    faListAlt,
    faTrashAlt,
    faSync,
    faExclamationTriangle,
    faPlus,
    faCog,
  } from '@fortawesome/free-solid-svg-icons';
  import { States } from '@mathesar/utils/api';
  import { Button, Icon, Dropdown } from '@mathesar-component-library';
  import type {
    TabularDataStore,
    TabularData,
    RecordsData,
    ColumnsDataStore,
    ColumnsData,
    Meta,
  } from '@mathesar/stores/table-data/types';
  import type { SelectOption } from '@mathesar-component-library/types';
  import type { ConstraintsDataStore } from '@mathesar/stores/table-data/types';
  import TableConstraints from '../constraints/TableConstraints.svelte';
  import DisplayFilter from '../display-options/DisplayFilter.svelte';
  import DisplaySort from '../display-options/DisplaySort.svelte';
  import DisplayGroup from '../display-options/DisplayGroup.svelte';

  const dispatch = createEventDispatcher();
  
  const tabularData = getContext<TabularDataStore>('tabularData');
  
  function getColumnOptions(columnsData: ColumnsData): SelectOption<string>[] {
    return columnsData?.columns?.map((column) => ({
      id: column.name,
      label: column.name,
    })) || [];
  }

  let recordsData: RecordsData;
  let columnsDataStore: ColumnsDataStore;
  let constraintsDataStore: ConstraintsDataStore;
  let meta: Meta;
  let recordState: RecordsData['state'];
  let isTableConstraintsModalOpen = false;

  $: ({
    columnsDataStore, recordsData, meta, constraintsDataStore,
  } = $tabularData as TabularData);
  $: ({
    filter, sort, group, selectedRecords, combinedModificationState,
  } = meta);
  $: ({ state: recordState } = recordsData);

  $: isLoading = $columnsDataStore.state === States.Loading
    || $recordState === States.Loading
    || $constraintsDataStore.state === States.Loading;
  $: isError = $columnsDataStore.state === States.Error
    || $recordState === States.Error
    || $constraintsDataStore.state === States.Error;
  $: columnOptions = getColumnOptions($columnsDataStore);

  function refresh() {
    void ($tabularData as TabularData).refresh();
  }
</script>

<div class="actions-pane">
  <Dropdown
    closeOnInnerClick={true}
    triggerClass="opts"
    contentClass="table-opts-content"
    ariaLabel="Table Actions"
  >
    <svelte:fragment slot="trigger">
      <Icon data={faCog}/>
      Table
    </svelte:fragment>
    <svelte:fragment slot="content">
      <ul>
        <li class="item" on:click={() => dispatch('deleteTable')}>
          Delete
        </li>
        <li class="item" on:click={() => { isTableConstraintsModalOpen = true; }}>
          Constraints
        </li>
      </ul>
    </svelte:fragment>
  </Dropdown>

  <TableConstraints bind:isOpen={isTableConstraintsModalOpen} />

  <div class="divider"/>

  <Dropdown showArrow={false}>
    <svelte:fragment slot="trigger">
      <Icon data={faFilter} size="0.8em"/>
      <span>
        Filters
        {#if $filter?.filters?.length > 0}
          ({$filter?.filters?.length})
        {/if}
      </span>
    </svelte:fragment>
    <svelte:fragment slot="content">
      <DisplayFilter options={columnOptions} {meta}/>
    </svelte:fragment>
  </Dropdown>

  <Dropdown showArrow={false}>
    <svelte:fragment slot="trigger">
      <Icon data={faSort}/>
      <span>
        Sort
        {#if $sort?.size > 0}
          ({$sort?.size})
        {/if}
      </span>
    </svelte:fragment>
    <svelte:fragment slot="content">
      <DisplaySort options={columnOptions} {meta}/>
    </svelte:fragment>
  </Dropdown>

  <Dropdown showArrow={false}>
    <svelte:fragment slot="trigger">
      <Icon data={faListAlt}/>
      <span>
        Group
        {#if $group?.size > 0}
          ({$group?.size})
        {/if}
      </span>
    </svelte:fragment>
    <svelte:fragment slot="content">
      <DisplayGroup options={columnOptions} {meta}/>
    </svelte:fragment>
  </Dropdown>

  <div class="divider"/>

  <Button size="small" on:click={() => recordsData.addEmptyRecord()}>
    <Icon data={faPlus}/>
    <span>
      New Record
    </span>
  </Button>

  {#if $selectedRecords.size > 0}
    <Button size="small" on:click={() => recordsData.deleteSelected()}>
      <Icon data={faTrashAlt}/>
      <span>
        Delete {$selectedRecords.size} records
      </span>
    </Button>
  {/if}

  {#if $combinedModificationState !== 'idle'}
    <div class="divider"/>
    <div class="save-status">
      {#if $combinedModificationState === 'inprocess'}
        Saving changes
      {:else if $combinedModificationState === 'error'}
        <span class="error">! Couldn't save changes</span>
      {:else if $combinedModificationState === 'complete'}
        All changes saved
      {/if}
    </div>
  {/if}

  <div class="loading-info">
    <Button size="small" disabled={isLoading} on:click={refresh}>
      <Icon data={
        isError && !isLoading ? faExclamationTriangle : faSync
      } spin={isLoading}/>
      <span>
        {#if isLoading}
          Loading
        {:else if isError}
          Retry
        {:else}
          Refresh
        {/if}
      </span>
    </Button>
  </div>
</div>

<style global lang="scss">
  @import "ActionsPane.scss";
</style>
