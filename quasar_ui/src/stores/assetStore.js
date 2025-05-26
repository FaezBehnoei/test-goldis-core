import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getWalletAssets } from 'src/services/walletServis'

export const useAssetsStore = defineStore('assets', () => {
  const assets = ref([])
  const colors = {
    'طلا خام': '#E7C24D',
    'نقره خام': '#8F8F8F',
    'موجودی ریالی': '#64C2A7',
  }
  const icons = {
    gold: 'gold',
    silver: 'silver',
    rial: 'dollar',
    ignot: 'shemsh',
    platinum: 'platinum',
    default: 'coin'
  }

  const fetchAssets = async () => {
    try {
      const response = await getWalletAssets()
      console.log(response)
      const enriched = response.assets.map(asset => ({
        ...asset,
        color: colors[asset.name],
        icon: icons[asset.slug]
      }))
      assets.value = enriched
    } catch (error) {
      console.error('خطا در دریافت دارایی‌ها:', error)
    }
  }

  const getAssetById = (id) => {
    return assets.value.find(asset => asset.id === id)
  }

  return {
    assets,
    fetchAssets,
    getAssetById
  }
})
