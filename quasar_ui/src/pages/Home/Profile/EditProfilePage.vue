<template>
  <q-page class="q-px-md q-py-sm">
    <div class="flex">
      <div class="typography-subtitle-medium flex flex-center">
        <div class="circle-div flex flex-center text-center"></div>
        <span class="q-mr-sm">اطلاعات فردی</span>
      </div>
    </div>
    <div>
      <ProfileFormComponent v-for="(item, index) in profileFields" :key="item.model"
        :label="item.label"
        :placeholder="item.placeholder"
        :value="item.model"
        :icon="item.icon"
        :type="item.type"
        :options="item.options"
        :dropdown="item.dropdown"
        ref="fieldRefs"
        @focus-next="focusNext(index)"
        @update:value="val => profileFields[index].model = val"
      />
    </div>
  </q-page>
</template>

<script setup>
import ProfileFormComponent from 'src/components/profile/profileFormComponent.vue';
import { computed, onMounted, ref } from 'vue';
import { useProfileStore } from 'src/stores/profileStore';

const profileStore = useProfileStore()
const profileData = computed(() => profileStore?.profileEdits)


const fieldRefs = ref([])

function focusNext(currentIndex) {
  const focusables = Array.from(
    document.querySelectorAll('.form-input, .dropdown-header')
  )

  const next = focusables[currentIndex + 1]
  if (next && typeof next.focus === 'function') {
    next.focus()
  }
}
const profileFields = ref([])

onMounted(async() => {
  await profileStore.getProfileEditInfo()
  console.log(profileData.value)
   profileFields.value =
  [
  {
    label: 'نام و نام خانوادگی',
    model: '',
    placeholder: profileData?.value.full_name,
    type: 'input',

  },
  {
    label: 'کد ملی',
    model: '',
    placeholder: profileData?.value.national_id,
   type: 'input',
  },
  {
    label: 'شماره همراه',
    model: '',
    placeholder: profileData?.value.phone_number,
    type: 'input',
    icon: true,
    editable: true
  },
  {
    label: 'رمز عبور',
    model: '',
    placeholder: profileData?.value.password,
    type: 'input',
    icon: true,
    editable: true
  },
  {
    label: 'جنسیت',
    model: '',
    type: 'select',
    options: ['مرد', 'زن'],
    dropdown: true,
    placeholder: profileData?.value.gender
  },
  {
    label: 'نحوه آشنایی',
    model: '',
    type: 'select',
    options: ['گوگل', 'اینستاگرام', 'دوست', 'سایر'],
    dropdown: true,
    placeholder: profileData?.value.referral_source || 'دوستان'
  },
  {
    label: 'ایمیل',
    model: '',
    placeholder: profileData?.value.email,
    type: 'input',
  }
]

})


</script>

<style scoped>
.circle-div{
  background-color: var(--orange-primary);
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
}
</style>
