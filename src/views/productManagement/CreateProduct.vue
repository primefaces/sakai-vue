<template>
    <div>
      <input type="file" @change="uploadImage" />
      <div v-if="imageUrl" class="image-preview">
        <h3>Uploaded Image:</h3>
        <!-- Display the image -->
        <img :src="imageUrl" alt="Uploaded Image" />
        <!-- Display the image path -->
        <p>Image URL: <a :href="imageUrl" target="_blank">{{ imageUrl }}</a></p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imageUrl: null, // To store the uploaded image URL
      };
    },
    methods: {
      async uploadImage(event) {
        const file = event.target.files[0];
  
        if (!file) {
          console.error('No file selected!');
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'cg0nwkaa'); // Replace with your actual preset
  
        try {
          const response = await fetch('https://api.cloudinary.com/v1_1/dstjfvua2/image/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} - ${response.statusText}`);
          }
  
          const data = await response.json();
          this.imageUrl = data.secure_url; // Store the secure URL of the uploaded image
          console.log('Uploaded image URL:', this.imageUrl);
        } catch (error) {
          console.error('Image upload failed:', error.message);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .image-preview {
    margin-top: 20px;
    text-align: center;
  }
  
  .image-preview img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
  }
  </style>
  