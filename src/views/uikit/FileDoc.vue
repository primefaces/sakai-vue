<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const fileupload = ref();

const upload = () => {
    fileupload.value.upload();
};

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12">
            <div class="card">
                <h5>Advanced</h5>
                <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload />
            </div>
            <div class="card">
                <h5>Basic</h5>
                <div class="card flex flex-col gap-6 items-center justify-center">
                    <Toast />
                    <FileUpload ref="fileupload" mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" />
                    <Button label="Upload" @click="upload" severity="secondary" />
                </div>
            </div>
        </div>
    </div>
</template>
