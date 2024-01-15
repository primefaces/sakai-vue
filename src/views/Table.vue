<script setup>
import { getPoints, getTags } from '@/service/PointService';
import { ref, onBeforeMount } from 'vue';

const points = ref()
const selectedPlatform = ref()
const from = ref();
const to = ref();
const limit = ref();


const platformOptions = ref([])

onBeforeMount(() => {
    getPoints(null, null, null, 100).then((data) => {
        points.value = data
    })

    getTags().then((data) => {
        for (const row of data) {
            platformOptions.value.push({
                name: row.platform_id,
                code: row.platform_id,
            })
        }
    })

});


function refreshPoints() {
    const inputPlatformID = (selectedPlatform.value) ? selectedPlatform.value.code : null
    const inputFrom = from.value || null
    const inputTo = to.value || null
    const inputLimit = limit.value || null
    getPoints(inputPlatformID, inputFrom, inputTo, inputLimit).then((data) => points.value = data)
}


function downloadTable() {
    const csv = jsonToCSV(points.value)
    let link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csv));
    link.setAttribute('download', `${new Date().getTime()}.csv`)
    link.click();
}

function jsonToCSV(data) {
    var csv = [Object.keys(data[0]).join(",")]
    for (const row of data) {
        const csvRow = Object.values(row).join(",")
        csv.push(csvRow)
    }
    return csv.join("\n")
}

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card p-fluid">
                <h5>搜尋點位</h5>
                <div class="formgroup-inline">
                    <div class="field">
                        <label for="platfrom-id">Platfrom ID</label>
                        <Dropdown id="platfrom-id" v-model="selectedPlatform" :options="platformOptions" optionLabel="name" class="w-full md:w-14rem" />
                    </div>
                    <div class="field">
                        <label for="calendar-from">From</label>
                        <Calendar id="calendar-from" v-model="from" showTime hourFormat="24" />
                    </div>
                    <div class="field">
                        <label for="calendar-to">To</label>
                        <Calendar id="calendar-to" v-model="to" showTime hourFormat="24" />
                    </div>
                    <div class="field">
                        <label for="limit">Limit</label>
                        <InputNumber id="limit" v-model="limit" :min="1" />
                    </div>

                </div>
                <div class="formgroup-inline">

                    <div class="field">
                        <Button label="Submit" @click="refreshPoints"></Button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="flex justify-content-between">
                    <h5>Lapwing Tracking</h5>
                    <Button label="Download" class="p-button-info mb-4" @click="downloadTable"></Button>
                </div>

                <DataTable :value="points" paginator :rows="10" :rowsPerPageOptions="[10, 50, 100]" tableStyle="min-width: 50rem">
                    <Column field="platform_id" sortable header="Platform_id" style="width: 25%"></Column>
                    <Column field="date_time" sortable header="Date Time" style="width: 25%"></Column>
                    <Column field="longitude" sortable header="Longitude" style="width: 25%"></Column>
                    <Column field="latitude" sortable header="Latitude" style="width: 25%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
