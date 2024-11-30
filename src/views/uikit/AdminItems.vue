<template>
    <div class="card">
      <div class="font-semibold text-xl mb-4">Admin Panel</div>
      <PanelMenu :model="categories" class="w-full" />
  
      <!-- Dialog for viewing/editing product -->
      <Dialog v-model:visible="dialogVisible" header="Product Details" :modal="true">
        <div>
          <!-- Editable fields for product details -->
          <div class="field">
            <label for="name">Name:</label>
            <input
              id="name"
              v-model="selectedProduct.name"
              class="p-inputtext p-component w-full mb-2"
              type="text"
            />
          </div>
          <div class="field">
            <label for="price">Price:</label>
            <input
              id="price"
              v-model="selectedProduct.price"
              class="p-inputtext p-component w-full mb-2"
              type="text"
            />
          </div>
          <div class="field">
            <label for="description">Description:</label>
            <textarea
              id="description"
              v-model="selectedProduct.description"
              class="p-inputtext p-component w-full mb-2"
            ></textarea>
          </div>
          <div class="field">
            <label for="shown">Visible in Front Office:</label>
            <select id="shown" v-model="selectedProduct.shown" class="p-inputtext p-component w-full mb-2">
              <option :value="true">Shown</option>
              <option :value="false">Hidden</option>
            </select>
          </div>
  
          <!-- Update and Close Buttons -->
          <Button label="Update" @click="updateProduct" class="mr-2" />
          <Button label="Close" @click="dialogVisible = false" />
        </div>
      </Dialog>
    </div>
  </template>
  
  <script>
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import { ref } from 'vue';
  
  export default {
    components: {
      Dialog,
      Button,
    },
    setup() {
      const dialogVisible = ref(false);
      const selectedProduct = ref({});
  
      // Format the label to include visibility indicator
      const formatLabel = ({ name, price, description, shown }) => {
        const visibility = shown ? '[Shown]' : '[Hidden]';
        return `${name} - ${price} (${description}) ${visibility}`;
      };
  
      const categories = ref([
        {
          label: 'Category 1',
          items: [
            {
              label: formatLabel({
                name: 'Product 1',
                price: '$10',
                description: 'Description 1',
                shown: true, // Visible in front office
              }),
              command: () =>
                viewProduct({
                  id: 1,
                  name: 'Product 1',
                  price: '$10',
                  description: 'Description 1',
                  shown: true,
                }),
            },
            {
              label: formatLabel({
                name: 'Product 2',
                price: '$20',
                description: 'Description 2',
                shown: false, // Hidden in front office
              }),
              command: () =>
                viewProduct({
                  id: 2,
                  name: 'Product 2',
                  price: '$20',
                  description: 'Description 2',
                  shown: false,
                }),
            },
          ],
        },
        {
          label: 'Category 2',
          items: [
            {
              label: formatLabel({
                name: 'Product 3',
                price: '$30',
                description: 'Description 3',
                shown: true,
              }),
              command: () =>
                viewProduct({
                  id: 3,
                  name: 'Product 3',
                  price: '$30',
                  description: 'Description 3',
                  shown: true,
                }),
            },
          ],
        },
      ]);
  
      const viewProduct = (product) => {
        selectedProduct.value = { ...product }; // Clone product data
        dialogVisible.value = true;
      };
  
      const updateProduct = () => {
        // Update the product in the categories array
        categories.value.forEach((category) => {
          category.items.forEach((item) => {
            if (item.label.includes(selectedProduct.value.name)) {
              // Update the label to reflect the new changes
              item.label = formatLabel({
                name: selectedProduct.value.name,
                price: selectedProduct.value.price,
                description: selectedProduct.value.description,
                shown: selectedProduct.value.shown,
              });
            }
          });
        });
  
        // Close dialog
        dialogVisible.value = false;
      };
  
      return {
        categories,
        dialogVisible,
        selectedProduct,
        updateProduct,
      };
    },
  };
  </script>
  
  <style>
  .card {
    padding: 1rem;
  }
  .field {
    margin-bottom: 1rem;
  }
  </style>
  