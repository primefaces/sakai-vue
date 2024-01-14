<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue'
import { addPoints } from '@/service/PointService'

const reader = new FileReader()
const toast = useToast();
const uploadPoints = ref([])

const onUpload = (event) => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });

    uploadPoints.value = []

    for (const file of event.files) {

        reader.readAsText(file)
        reader.onload = () => {

            const points = txtToPoints(reader.result)
            for (const point of points) {
                uploadPoints.value.push(point)
            }
        }
    }


};

function txtToPoints(content) {
    const points = []
    for (const line of content.split("\n")) {
        const values = line.split(" ")
        if (values[0] == "") {
            continue
        }

        const noSpaceValues = []
        for (const value of values) {
            if (value != "") {
                noSpaceValues.push(value)
            }
        }
        if (!noSpaceValues[8] || !noSpaceValues[9]) {
            continue
        }
        const datetime = new Date(`${noSpaceValues[6]} ${noSpaceValues[7]}`)
        points.push({
            "platform_id": noSpaceValues[1],
            "date_time": datetime.toISOString(),
            "latitude": noSpaceValues[8],
            "longitude": noSpaceValues[9],
        })

    }
    return points

}

function fetchPoints() {
    if (uploadPoints.value.length == 0) {
        toast.add({ severity: 'info', summary: 'Info', detail: '沒有資料可以上傳', life: 3000 });
        return
    }

    addPoints(uploadPoints.value).then((res) => {
        toast.add({ severity: 'success', summary: 'Success', detail: '上傳成功', life: 3000 });
        uploadPoints.value = []
    }).catch((e) => {
        toast.add({ severity: 'warning', summary: 'Warning', detail: '上傳失敗', life: 3000 });
    })
}

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>上傳點位資料</h5>
                <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" :maxFileSize="1000000" customUpload />
            </div>
        </div>
        <Toast />
    </div>
    <div class="card">
        <div class="flex justify-content-between">
            <h5>上傳資料</h5>
            <Button label="上傳資料" @click="fetchPoints"></Button>
        </div>
        <DataTable :value="uploadPoints" paginator :rows="10" :rowsPerPageOptions="[10, 50, 100]" tableStyle="min-width: 50rem">
            <Column field="platform_id" sortable header="Platform_id" style="width: 25%"></Column>
            <Column field="date_time" sortable header="Date Time" style="width: 25%"></Column>
            <Column field="longitude" sortable header="Longitude" style="width: 25%"></Column>
            <Column field="latitude" sortable header="Latitude" style="width: 25%"></Column>
        </DataTable>
    </div>
</template>
