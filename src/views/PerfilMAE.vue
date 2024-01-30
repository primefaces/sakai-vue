<script setup>
import { ref } from 'vue';
const fecha = "Martes 14 de Noviembre de 2023"
const showMoreTags = ref(false);
const materias = [
  "tc2005b","tc2005b","tc2005b","tc2005b","tc2005b","tc2005b",
  "tc2005b","tc2005b","tc2005b","tc2005b","tc2005b","tc2005b",
  "tc2005b","tc2005b","tc2005b","tc2005b","tc2005b","tc2005b",
  "tc2005b","tc2005b","tc2005b","tc2005b","tc2005b","tc2005b",
];

const horario = [
  { dia: 'Día', lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', horas: 'Horas' },
  { lunesInicio: '11:00', lunesFin: '12:00', martesInicio: '11:00', martesFin: '12:00', miercolesInicio: '11:00', miercolesFin: '12:00', juevesInicio: '11:00', juevesFin: '12:00', viernesInicio: '11:00', viernesFin: '12:00' },
];
</script>

<template>
  <div class="overflow-hidden font-lato px-4">
    <div class="flex relative mt-5">
      <div class="flex-1">
        <div class="text-0D294C text-6xl  ml-2.4%">Perfil</div>
      </div>

      <div class="justify-end">
        <i class="pi pi-bell text-6xl"></i>
        <!-- <Button label="Generar Reporte" icon="pi pi-file-export" severity="info" size="large" class="ml-5 bg-0D294C" /> -->
      </div>
    </div>
    <hr class="width-5 border-t-2 border-D6D6D6 mb-2 ml-2.4%" />
    <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
    <p class="text-4xl">{{fecha}} </p>
    <div class="border-b-2 border-d6d6d6 w-full mb-5 ml-2.4%"></div>
    <div class="text-0D294C text-4xl  ml-2.4%">Materias</div>
    <div class="flex flex-wrap">
    <!-- Mostrar las primeras dos filas de etiquetas -->
    <div v-for="(materia, index) in materias.slice(0, showMoreTags ? Infinity : 12)" :key="index"
     class="width-2 h-2 p-4">
        <Tag
    rounded
    class="w-full h-12 text-lg font-semibold bg-FF69B4 text-white"  
  >
        {{ materia }}
      </Tag>
    </div>

    <!-- Mostrar el botón "más/menos" si hay más etiquetas -->
    <div v-if="materias.length > 12" @click="showMoreTags = !showMoreTags" class="w-full p-2 cursor-pointer ">
        <div class="flex relative mt-3">
            <div class="flex-1"></div>
            <div class="justify-end">
                <Button
                    :class="{'pi pi-plus-circle': !showMoreTags, 'pi pi-minus-circle': showMoreTags}" 
                     size="large" class="ml-5 bg-FF69B4"
                    label="Etiquetas"
                />
            </div>
        </div>
    </div>
  </div>

    <hr class=" border-t-2 border-D6D6D6 " />
    <div class="text-0D294C text-4xl  ml-2.4%">Horario</div>

    <DataTable :value="horario" class="p-datatable-striped">
    <Column field="dia" header="Día" :headerStyle="{ 'background': '#E2F4E4', 'font-weight': 'bold' }" />
    <Column field="lunes" header="Lunes" />
    <Column field="martes" header="Martes" />
    <Column field="miercoles" header="Miércoles" />
    <Column field="jueves" header="Jueves" />
    <Column field="viernes" header="Viernes" />

    <Column field="horas" header="Horas" :headerStyle="{ 'background': '#E2F4E4', 'font-weight': 'bold' }" />
    <Column field="lunesInicio" />
    <Column field="lunesFin" />

    <Column field="martesInicio" />
    <Column field="martesFin" />

    <Column field="miercolesInicio" />
    <Column field="miercolesFin" />

    <Column field="juevesInicio" />
    <Column field="juevesFin" />

    <Column field="viernesInicio" />
    <Column field="viernesFin" />
  </DataTable>

  </div>
</template>

<style scoped>
/* Estilo de colores */
.text-0D294C {
  color: #0D294C;
  font-weight: bold;
}

.bg-FF69B4{
    background-color: #FF69B4
}
/* Estilo del botón */
.bg-0D294C {
  background-color: #0D294C;
  color: #fff;
  border: 1px solid #0D294C;
  border-radius: 20px;
}

/* Línea gris */
.border-D6D6D6 {
  border-color: #D6D6D6;
}

/* Establece el tamaño fijo de la línea horizontal */
.width-5 {
  width: 41.6667%;
}
.width-2{
    width: 16.6667%;
}

@media (max-width: 768px) {
  .width-2 {
    width: 25%; 
  }
}

@media (max-width: 768px) {
  .width-5 {
    width: 55%; 
  }
}

.p-datatable-striped tbody tr:nth-child(odd) {
  background-color: #16591D !important;
}

.p-datatable-striped .p-datatable-thead th {
  color: #fff !important;
}
</style>
