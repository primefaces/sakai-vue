<template>
       <div class="sm:flex">
      <div class="sm:flex sm:flex-1 justify-center w-full">
        <div class="flex">
          <Skeleton size="16rem" shape="circle" class="mb-2 sm:mr-5"></Skeleton>
        </div>
        <div class="mb-2 sm:mb-0 justify-center">
          <Skeleton height="36px" width="20rem" class="mb-2"></Skeleton>
          <Skeleton height="28px" width="20rem" class="mb-2"></Skeleton>
          <Skeleton height="28px" width="20rem" class="mb-2"></Skeleton>
          <Skeleton height="28px" width="20rem" class="mb-2"></Skeleton>
          <Skeleton height="28px" width="20rem" class="mb-2"></Skeleton>
          <Skeleton height="28px" width="20rem" class="mb-2"></Skeleton>
        </div>
      </div>
    </div>
    <h2 class="font-bold text-center sm:text-left"> Materias </h2>
    <div class="mb-2">
      <Skeleton height="34px" class="p-mr-2"></Skeleton>
    </div>
    <div class="flex">
      <Skeleton width="20%" height="34px" borderRadius="16px" class="mr-2"></Skeleton>
      <Skeleton width="60%" height="34px" borderRadius="16px" class="mx-2"></Skeleton>
      <Skeleton width="40%" height="34px" borderRadius="16px" class="ml-2"></Skeleton>
    </div>

    <hr />
    <h2 class="font-bold text-center sm:text-left"> Horario </h2>

    <div>
      <div class="grid">
        <div v-for="day in daysArray" class="md:col col-12">
          <div class="text-center p-3 border-round-sm bg-gray-200 text-xl font-bold">{{ day['es'] }}</div>
            <div class="text-center p-3 border-round-sm bg-gray-100 text-black text-xl font-bold mt-2"> N/A </div>
        </div>
    </div>
    </div>
</template>