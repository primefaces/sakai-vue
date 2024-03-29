<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const value = ref(0);
let interval = null;

const startProgress = () => {
    interval = setInterval(() => {
        let newValue = value.value + Math.floor(Math.random() * 10) + 1;
        if (newValue >= 100) {
            newValue = 100;
        }
        value.value = newValue;
    }, 2000);
};
const endProgress = () => {
    clearInterval(interval);
    interval = null;
};

onMounted(() => {
    startProgress();
});

onBeforeUnmount(() => {
    endProgress();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>ProgressBar</h5>
                <div class="grid">
                    <div class="col">
                        <ProgressBar :value="value"></ProgressBar>
                    </div>
                    <div class="col">
                        <ProgressBar :value="50" :showValue="false"></ProgressBar>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 lg:col-6">
            <div class="card">
                <h4>Badge</h4>
                <h5>Numbers</h5>
                <div class="badges">
                    <Badge :value="2" class="mr-2"></Badge>
                    <Badge :value="8" severity="success" class="mr-2"></Badge>
                    <Badge :value="4" severity="info" class="mr-2"></Badge>
                    <Badge :value="12" severity="warning" class="mr-2"></Badge>
                    <Badge :value="3" severity="danger"></Badge>
                </div>

                <h5>Positioned Badge</h5>
                <i class="pi pi-bell mr-4 p-text-secondary" style="font-size: 2rem" v-badge="2"></i>
                <i class="pi pi-calendar mr-4 p-text-secondary" style="font-size: 2rem" v-badge.danger="'10+'"></i>
                <i class="pi pi-envelope p-text-secondary" style="font-size: 2rem" v-badge.danger></i>

                <h5>Inline Button Badge</h5>
                <Button label="Emails" badge="8" class="mr-2"></Button>
                <Button label="Messages" icon="pi pi-users" class="p-button-warning" badge="8" badgeClass="p-badge-danger"></Button>

                <h5>Sizes</h5>
                <div class="badges">
                    <Badge :value="2" class="mr-2"></Badge>
                    <Badge :value="4" size="large" severity="warning" class="mr-2"></Badge>
                    <Badge :value="6" size="xlarge" severity="success"></Badge>
                </div>
            </div>

            <div class="card">
                <h4>Avatar</h4>
                <h5>Avatar Group</h5>
                <AvatarGroup class="mb-3">
                    <Avatar :image="'/demo/images/avatar/amyelsner.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'/demo/images/avatar/asiyajavayant.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'/demo/images/avatar/onyamalimba.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'/demo/images/avatar/ionibowcher.png'" size="large" shape="circle"></Avatar>
                    <Avatar :image="'/demo/images/avatar/xuxuefeng.png'" size="large" shape="circle"></Avatar>
                    <Avatar label="+2" shape="circle" size="large" :style="{ 'background-color': '#9c27b0', color: '#ffffff' }"></Avatar>
                </AvatarGroup>

                <h5>Label - Circle</h5>
                <Avatar label="P" class="mr-2" size="xlarge" shape="circle"></Avatar>
                <Avatar label="V" class="mr-2" size="large" :style="{ 'background-color': '#2196F3', color: '#ffffff' }" shape="circle"></Avatar>
                <Avatar label="U" class="mr-2" :style="{ 'background-color': '#9c27b0', color: '#ffffff' }" shape="circle"></Avatar>

                <h5>Icon - Badge</h5>
                <Avatar icon="pi pi-user" class="mr-2" size="xlarge" v-badge.success="4"></Avatar>
            </div>

            <div class="card">
                <h4>ScrollTop</h4>
                <ScrollPanel :style="{ width: '250px', height: '200px' }">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae et leo duis ut diam. Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur
                        adipiscing elit ut. Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor
                        augue mauris. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet
                        nisl purus. Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas. Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris. Eget egestas purus
                        viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer. Mattis aliquam faucibus purus in massa tempor nec.
                    </p>
                    <ScrollTop target="parent" :threshold="100" icon="pi pi-arrow-up"></ScrollTop>
                </ScrollPanel>
            </div>
        </div>
        <div class="col-12 lg:col-6">
            <div class="card">
                <h4>Tag</h4>
                <h5>Tags</h5>
                <Tag class="mr-2" value="Primary"></Tag>
                <Tag class="mr-2" severity="success" value="Success"></Tag>
                <Tag class="mr-2" severity="info" value="Info"></Tag>
                <Tag class="mr-2" severity="warning" value="Warning"></Tag>
                <Tag severity="danger" value="Danger"></Tag>

                <h5>Pills</h5>
                <Tag class="mr-2" value="Primary" :rounded="true"></Tag>
                <Tag class="mr-2" severity="success" value="Success" :rounded="true"></Tag>
                <Tag class="mr-2" severity="info" value="Info" :rounded="true"></Tag>
                <Tag class="mr-2" severity="warning" value="Warning" :rounded="true"></Tag>
                <Tag severity="danger" value="Danger" :rounded="true"></Tag>

                <h5>Icons</h5>
                <Tag class="mr-2" icon="pi pi-user" value="Primary"></Tag>
                <Tag class="mr-2" icon="pi pi-check" severity="success" value="Success"></Tag>
                <Tag class="mr-2" icon="pi pi-info-circle" severity="info" value="Info"></Tag>
                <Tag class="mr-2" con="pi pi-exclamation-triangle" severity="warning" value="Warning"></Tag>
                <Tag icon="pi pi-times" severity="danger" value="Danger"></Tag>
            </div>

            <div class="card">
                <h4>Chip</h4>
                <h5>Basic</h5>
                <div class="flex align-items-center flex-column sm:flex-row">
                    <Chip label="Action" class="mr-2 mb-2"></Chip>
                    <Chip label="Comedy" class="mr-2 mb-2"></Chip>
                    <Chip label="Mystery" class="mr-2 mb-2"></Chip>
                    <Chip label="Thriller" :removable="true" class="mb-2"></Chip>
                </div>

                <h5>Icon</h5>
                <div class="flex align-items-center flex-column sm:flex-row">
                    <Chip label="Apple" icon="pi pi-apple" class="mr-2 mb-2"></Chip>
                    <Chip label="Facebook" icon="pi pi-facebook" class="mr-2 mb-2"></Chip>
                    <Chip label="Google" icon="pi pi-google" class="mr-2 mb-2"></Chip>
                    <Chip label="Microsoft" icon="pi pi-microsoft" :removable="true" class="mb-2"></Chip>
                </div>

                <h5>Image</h5>
                <div class="flex align-items-center flex-column sm:flex-row">
                    <Chip label="Amy Elsner" :image="'/demo/images/avatar/amyelsner.png'" class="mr-2 mb-2"></Chip>
                    <Chip label="Asiya Javayant" :image="'/demo/images/avatar/asiyajavayant.png'" class="mr-2 mb-2"></Chip>
                    <Chip label="Onyama Limba" :image="'/demo/images/avatar/onyamalimba.png'" class="mr-2 mb-2"></Chip>
                </div>
            </div>

            <div class="card">
                <h4>Skeleton</h4>
                <div class="border-round border-1 surface-border p-4">
                    <div class="flex mb-3">
                        <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                        <div>
                            <Skeleton width="10rem" class="mb-2"></Skeleton>
                            <Skeleton width="5rem" class="mb-2"></Skeleton>
                            <Skeleton height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <Skeleton width="100%" height="150px"></Skeleton>
                    <div class="flex justify-content-between mt-3">
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
