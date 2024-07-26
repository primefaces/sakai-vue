<script setup>
import { onMounted, ref } from 'vue';
import { NodeService } from '@/service/NodeService';

const treeValue = ref(null);
const selectedTreeValue = ref(null);
const treeTableValue = ref(null);
const selectedTreeTableValue = ref(null);

onMounted(() => {
    NodeService.getTreeNodes().then((data) => (treeValue.value = data));
    NodeService.getTreeTableNodes().then((data) => (treeTableValue.value = data));
});
</script>

<template>
    <div class="card">
        <h5 class="mb-4">Tree</h5>
        <Tree :value="treeValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeValue"></Tree>
    </div>

    <div class="card">
        <h5 class="mb-4">TreeTable</h5>
        <TreeTable :value="treeTableValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeTableValue">
            <template #header> FileSystem </template>
            <Column field="name" header="Name" :expander="true"></Column>
            <Column field="size" header="Size"></Column>
            <Column field="type" header="Type"></Column>
        </TreeTable>
    </div>
</template>
