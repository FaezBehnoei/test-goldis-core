<template>
  <div v-if="props.modelValue" class="new-address-dialog">
    <!-- Map Section -->
    <div id="leaflet-map" class="leaflet-map"></div>

    <!-- Address Input Section -->
    <div class="form-section">
      <div class="full-width flex flex-center q-mb-md">
        <div class="section-divider"></div>
      </div>
      <InputComponent label="آدرس" v-model="address.address" type="text" placeholder="صادقیه،فلکه سوم،خیابان محمدی" class="text-input" />

      <div class="row">
        <div class="column">
          <InputComponent label="پلاک" v-model="address.buildingNumber" type="text" class="text-input" />
        </div>
        <div class="column">
          <InputComponent label="واحد" v-model="address.unit" type="text" class="text-input" />
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="submit-button">
      <ButtonComponent label="تایید" size="lg" @click="submitAddress" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ButtonComponent from 'components/ButtonComponent.vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import InputComponent from '../InputComponent.vue';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue'])

const address = ref({
  title: 'آدرس جدید',
  address: '',
  buildingNumber: '',
  unit: '',
  latitude: 35.7219,
  longitude: 51.3347
});

let map = null;
let marker = null;

function initMap() {
  map = L.map('leaflet-map', {
    center: [address.value.latitude, address.value.longitude],
    zoom: 15,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  const markerHtml = `
  <div class="custom-marker">
    <img src="/icons/name=pin, state=black, size=20px.svg" class="marker-icon" alt="marker" />
  </div>
`;

const icon = L.divIcon({
  html: markerHtml,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});


  marker = L.marker([address.value.latitude, address.value.longitude], {
    icon
  }).addTo(map);

  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    address.value.latitude = lat;
    address.value.longitude = lng;
  });

  // اطمینان از اینکه نقشه درست رندر می‌شه
  setTimeout(() => map.invalidateSize(), 500);
}


onMounted(() => {
  setTimeout(() => {
    initMap();
    setTimeout(() => map.invalidateSize(), 300);
  }, 300);
});

function submitAddress() {
  emit('update:modelValue', false);
}

watch(() => props.modelValue, (val) => {
  if (val) {
    setTimeout(() => {
      initMap()
      setTimeout(() => map.invalidateSize(), 300)
    }, 300)
  }
})
</script>

<style scoped>
.new-address-dialog {
  position: fixed;
  inset: 0;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  z-index: 9999;
}

.leaflet-map {
  width: 100%;
  height: 28rem;
  border-radius: 1.25rem 1.25rem 0 0 ;
  background-color: #E5EFF5;
  margin-bottom: 0.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


.row {
  display: flex;
  gap: 1rem;
}

.column {
  flex: 1;
}

.submit-button {
  margin-top: auto;
  padding-top: 1.5rem;
}

::v-deep .custom-marker {
  width: 32px;
  height: 32px;
  background-color: var(--orange-primary);
  border-radius: 50%;
  border: 1px solid rgba(145, 162, 182, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .marker-icon {
  width: 20px;
  height: 20px;
}
.section-divider {
  height: 3px;
  width: 2.5rem;
  background-color: var(--grey-normal-hover); /* دقیق مثل رنگ طرح */
}

</style>
