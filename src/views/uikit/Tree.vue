<script setup>
import { onMounted, ref } from 'vue';
import { NodeService } from '@/service/NodeService';

const treeValue = ref(null);
const selectedTreeValue = ref(null);
const treeTableValue = ref(null);
const selectedTreeTableValue = ref(null);
const nodeService = new NodeService();

onMounted(() => {
    nodeService.getTreeNodes().then((data) => (treeValue.value = data));
    nodeService.getTreeTableNodes().then((data) => (treeTableValue.value = data));
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Tree</h5>
                <Tree :value="treeValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeValue"></Tree>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <h5>TreeTable</h5>
                <TreeTable :value="treeTableValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeTableValue">
                    <template #header> FileSystem </template>
                    <Column field="name" header="Name" :expander="true"></Column>
                    <Column field="size" header="Size"></Column>
                    <Column field="type" header="Type"></Column>
                </TreeTable>
            </div>
        </div>
    </div>
</template>
