import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProfile, getProfileEdit, getProfileNotifications } from 'src/services/profileServices'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)
  const profileEdits = ref(null)
  const unreadNotificationCount = ref(0)

  // اطلاعات پروفایل را از API می‌گیرد
  async function fetchProfile() {
    const data = await getProfile()
    profile.value = data
  }

  // edit profile informations
  async function getProfileEditInfo() {
    const data = await getProfileEdit()
    profileEdits.value = data
  }
  // edit profile informations
  async function submitProfileEditInfo(profileData) {
    const data = await getProfileEdit(profileData)
    profileEdits.value = data
  }

  // set profile Fields
  function setProfileField(field, value) {
  if (profileEdits.value) {
    profileEdits.value[field] = value
  }
}

  // چک کردن تعداد نوتیف‌های خوانده‌نشده
  async function fetchUnreadNotifications() {
    const data = await getProfileNotifications()
    unreadNotificationCount.value = data.filter(n => !n.isRead).length
  }

  // ریست کردن نوتیف‌ها بعد از خواندن
  function clearUnreadNotifications() {
    unreadNotificationCount.value = 0
  }

  return {
    profile,
    profileEdits,
    unreadNotificationCount,
    fetchProfile,
    setProfileField,
    fetchUnreadNotifications,
    clearUnreadNotifications,
    getProfileEditInfo,
    submitProfileEditInfo
  }
})
