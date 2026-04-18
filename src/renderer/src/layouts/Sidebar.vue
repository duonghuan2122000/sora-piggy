<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Tooltip as AntTooltip } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import {
  faChartLine,
  faExchangeAlt,
  faWallet,
  faBullseye,
  faFileAlt,
  faMoneyBillWave,
  faUniversity,
  faPiggyBank
} from '@fortawesome/free-solid-svg-icons';

const { t } = useI18n();
const route = useRoute();
const activeKey = ref<string>(route.name as string);

watch(() => route.name, (newName) => {
  activeKey.value = newName as string;
});

interface MenuItem {
  key: string;
  label: string;
  icon: IconDefinition;
  to: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Summary',
    items: [
      { key: 'Dashboard', label: 'Dashboard', icon: faChartLine, to: '/dashboard' },
      { key: 'Transaction', label: 'Transaction', icon: faExchangeAlt, to: '/transactions' }
    ]
  },
  {
    title: 'Management',
    items: [
      { key: 'Budget', label: 'Budget', icon: faWallet, to: '/budget' },
      { key: 'Target', label: 'Target', icon: faBullseye, to: '/targets' },
      { key: 'Report', label: 'Report', icon: faFileAlt, to: '/reports' }
    ]
  },
  {
    title: 'Account',
    items: [
      { key: 'Cash', label: 'Cash', icon: faMoneyBillWave, to: '/accounts/cash' },
      { key: 'Bank', label: 'Bank', icon: faUniversity, to: '/accounts/bank' }
    ]
  }
];

// Computed property to get localized menu groups
const localizedMenuGroups = computed(() => {
  return menuGroups.map((group) => ({
    ...group,
    title: t(`sidebar.${group.title.toLowerCase()}`),
    items: group.items.map((item) => ({
      ...item,
      label: t(`sidebar.${item.key.toLowerCase()}`)
    }))
  }));
});

const isActive = (key: string): boolean => {
  return activeKey.value === key;
};

const setActive = (key: string): void => {
  activeKey.value = key;
};

interface Props {
  collapsed: boolean;
}

defineProps<Props>();
</script>

<template>
  <div class="sora-sidebar" :class="{ 'sora-sidebar--collapsed': collapsed }">
    <!-- Top Section: Logo and App Name -->
    <div class="sora-sidebar__header">
      <div class="sora-logo">
        <font-awesome-icon :icon="faPiggyBank" style="font-size: 14px" />
      </div>
      <span v-if="!collapsed" class="sora-app-name">Sora Piggy</span>
    </div>

    <!-- Bottom Section: Menu -->
    <div class="sora-sidebar__menu">
      <div v-for="group in localizedMenuGroups" :key="group.title" class="sora-menu-group">
        <div v-if="!collapsed" class="sora-menu-group__title">{{ group.title }}</div>
        <div class="sora-menu-group__items">
          <RouterLink
            v-for="item in group.items"
            :key="item.key"
            :to="item.to"
            class="sora-menu-item"
            :class="{ 'sora-menu-item--active': isActive(item.key) }"
            @click="setActive(item.key)"
          >
            <AntTooltip placement="right" :visible="collapsed" :title="item.label">
              <div class="sora-menu-item__content">
                <font-awesome-icon :icon="item.icon" class="sora-menu-item__icon" />
                <span v-if="!collapsed" class="sora-menu-item__label">{{ item.label }}</span>
              </div>
            </AntTooltip>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sora-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f8f9fa;
  color: #374151;

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    gap: 10px;
    border-bottom: 1px solid #e5e7eb;
    padding: 0 16px;
  }

  &__menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    overflow-y: auto;
  }

  &--collapsed {
    .sora-sidebar__header {
      padding: 0;
    }
  }
}

.sora-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #3b82f6;
  border-radius: 8px;
  font-size: 16px;
  color: #ffffff;
}

.sora-app-name {
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.5px;
  color: #374151;
}

.sora-menu-group {
  margin-bottom: 16px;

  &__title {
    padding: 8px 16px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    letter-spacing: 1px;
  }

  &__items {
    display: flex;
    flex-direction: column;
  }
}

.sora-menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 2px 8px;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    color: #111827;
  }

  &--active {
    background-color: #3b82f6;
    color: #ffffff;
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__icon {
    width: 20px;
    margin-right: 12px;
    text-align: center;
    font-size: 14px;
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
  }
}

.sora-sidebar--collapsed {
  .sora-menu-item {
    justify-content: center;
    padding: 12px;
    margin: 2px 0;
    width: 100%;

    &__content {
      justify-content: center;
    }

    &__icon {
      margin-right: 0;
    }
  }
}
</style>
