<template>
  <div class="header">
    <div class="header__container" ref="header-container">
      <div class="header__row">
        <button class="header__btn header__btn--menu" aria-label="Меню">
          <Icon class="header__icon header__icon--burger" :name="isMobileMenuOpened ? 'nav-close' : 'nav-burger'" @click.native="mobileMenuBtnHandler" />
        </button>
        <AppHeaderLogo class="header__logo" />
        <AppHeaderUserMenu class="header__user-menu" />
      </div>
      <div class="header__row">
        <AppHeaderCatalogBtn class="header__btn header__btn--catalog" @click.native.prevent="mobileCatalogBtnHandler" />
        <AppSearch class="header__search" />
      </div>
    </div>
    <div class="header__wrapper header__wrapper--menu">
      <ul class="header-menu" :style="dropdown" :class="{'header-menu_opened': isMobileMenuOpened}">
        <li class="header-menu__item">
          <button class="header-menu__link">
            Прайс-лист
          </button>
        </li>
        <li class="header-menu__item">
          <button class="header-menu__link">
            Отслеживание заказа
          </button>
        </li>
        <li class="header-menu__item">
          <button class="header-menu__link">
            Каталог товаров
          </button>
        </li>
        <li class="header-menu__item">
          <nuxt-link class="header-menu__link" to="/info/delivery/">
            Доставка
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </nuxt-link>
        </li>
        <li class="header-menu__item">
          <nuxt-link class="header-menu__link" to="/about/">
            О компании
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </nuxt-link>
        </li>
        <li class="header-menu__item">
          <nuxt-link class="header-menu__link" to="/info/contacts/">
            Контакты
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </nuxt-link>
        </li>
        <li class="header-menu__item">
          <ExternalLink class="header-menu__link" href="https://gdematerial.ru/blog/" target="_blank">
            Блог
          </ExternalLink>
        </li>
        <li class="header-menu__item">
          <ExternalLink class="header-menu__link" href="https://partner.gdml.ru" target="_blank">
            Поставщикам
          </ExternalLink>
        </li>
      </ul>
      <ul class="header-catalog" :style="dropdownCatalog" :class="{'header-catalog_opened': isCatalogOpened}">
        <li class="header-catalog__item">
          <span class="header-catalog__link header-catalog__link_highlighted" v-if="currentCategory" @click="backToOuterTree">
            Назад к {{ currentCategory.name }}
          </span>
        </li>
        <li
          class="header-catalog__item"
          v-for="item in catalog"
          :key="item.id"
        >
          <nuxt-link
            class="header-catalog__link"
            :to="`/catalog/${currentCategory ? (currentCategory.slug + '-' + currentCategory.id) : ''}`"
            :event="(item.submenu ? '' : 'click')"
            @click.native="showInnerTree(item), event => event.preventDefault()"
          >
            {{ item.name }}
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" v-if="item.submenu" />
          </nuxt-link>
        </li>
        <li class="header-catalog__item">
          <nuxt-link class="header-catalog__link header-catalog__link_highlighted" :to="`/catalog/${currentCategory ? (currentCategory.slug + '-' + currentCategory.id) : ''}`">
            {{ currentCategory ? 'Все товары категории' : 'Все товары' }}
            <Icon class="header-menu__icon header-menu__icon--angle-right" name="gm-angle-right" />
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppHeaderLogo from '~/components/AppHeader/AppHeaderLogo.vue';
import AppHeaderUserMenu from '~/components/AppHeader/mobile/AppHeaderUserMenu.vue';
import AppHeaderCatalogBtn from '~/components/AppHeader/buttons/AppHeaderCatalogBtn.vue';
import AppSearch from '~/components/AppSearch/AppSearch.vue';
import ExternalLink from '~/components/ExternalLink.vue';
import FreezeScrollMixin from '~/mixins/FreezeScrollMixin.vue';

export default {
  components: {
    AppHeaderLogo,
    AppHeaderUserMenu,
    AppHeaderCatalogBtn,
    AppSearch,
    ExternalLink,
  },
  mixins: [FreezeScrollMixin],
  data() {
    return {
      dropdown: { height: 0 },
      dropdownCatalog: { height: 0 },
      currentCategory: null,
      depthHistory: [],
    };
  },
  computed: {
    isMobileMenuOpened() {
      return this.$store.getters['the_menu/isMobileMenuOpened'];
    },
    isCatalogOpened() {
      return this.$store.getters['the_catalog/isMobileCatalogOpened'];
    },
    catalog() {
      if (this.currentCategory) {
        return this.currentCategory.submenu;
      }
      return this.$store.getters['the_catalog/getCatalog'];
    },
  },
  watch: {
    isMobileMenuOpened(value) {
      this.$nextTick(() => {
        if (value) {
          this.dropdown.height = `${window.innerHeight - this.$refs['header-container'].clientHeight}px`;
        } else {
          this.dropdown.height = '0';
        }
      });
    },
    isCatalogOpened(value) {
      this.$nextTick(() => {
        if (value) {
          this.dropdownCatalog.height = `${window.innerHeight - this.$refs['header-container'].clientHeight}px`;
        } else {
          this.dropdownCatalog.height = '0';
        }
      });
    },
  },
  methods: {
    mobileMenuBtnHandler() {
      if (this.isCatalogOpened) {
        this.mobileCatalogBtnHandler();
      }
      this.$store.commit('the_menu/toggleMobileMenuState');
      if (this.isMobileMenuOpened) {
        this.freezeScroll();
      } else {
        this.unfreezeScroll();
      }
    },
    mobileCatalogBtnHandler() {
      if (this.isMobileMenuOpened) {
        this.mobileMenuBtnHandler();
      }
      this.$store.commit('the_catalog/toggleMobileCatalogState');
      if (this.isCatalogOpened) {
        this.freezeScroll();
      } else {
        this.currentCategory = null;
        this.depthHistory = [];
        this.unfreezeScroll();
      }
    },
    showInnerTree(item) {
      if (item.submenu) {
        this.currentCategory = item;
        this.depthHistory.push(item);
      }
    },
    backToOuterTree() {
      this.depthHistory.pop();
      if (this.depthHistory.length) {
        this.currentCategory = this.depthHistory[this.depthHistory.length - 1];
      } else {
        this.currentCategory = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  &__container {
    max-width: $container-xl;
    padding: 10px 8px 10px 8px;
    margin: 0 auto;
  }

  &__row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__user-menu {
    margin-left: auto;
  }

  &__search {
    flex-grow: 1;
  }

  &__btn {
    flex-shrink: 0;

    &--menu {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin-right: 18px;
      color: hsl(0, 0%, 0%);
      cursor: pointer;
      background-color: transparent;
      border: none;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    &--catalog {
      margin-right: 5px;
    }
  }

  &__icon {
    &--burger {
      width: 20px;
      height: 14px;
    }
  }
}

.header-menu {
  --link-background-color: hsl(0, 0%, 100%);
  --link-border-radius: 0;
  --link-padding: 6px 8px;
  --link-color: hsl(198, 23%, 19%);
  --link-outline-color: transparent;
  --icon--angle-right-color: hsl(199, 22%, 77%);

  display: none;
  padding: 0;
  overflow-y: scroll;
  list-style: none;
  background-color: hsl(0, 0%, 100%);
  transition: height 0.3s;

  &__item {
    @media (min-width: $screen-lg) {
      --link-padding: 7px 20px;
    }

    &:hover,
    &--active {
      --link-background-color: hsl(230, 78%, 51%);
      --link-color: hsl(0, 0%, 100%);
      --link-outline-color: hsl(230, 78%, 51%);
      --icon--angle-right-color: hsl(0, 0%, 100%);
    }

    &:first-child {
      margin-top: 10px;

      @media (min-width: $screen-lg) {
        --link-padding: 16px 20px 10px 20px;
      }
    }

    &:last-child {
      @media (min-width: $screen-lg) {
        --link-padding: 10px 20px 16px 20px;
      }
    }
  }

  &__link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--link-padding);
    font-family: $font-family-montserrat;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: var(--link-color);
    cursor: pointer;
    background-color: var(--link-background-color);
    border: 1px solid transparent;
    border-radius: var(--link-border-radius);
    outline: none;
    -webkit-tap-highlight-color: transparent;

    @media (min-width: $screen-lg) {
      outline: 3px solid var(--link-outline-color);
    }
  }

  &__icon {
    flex-shrink: 0;

    &--angle-right {
      width: 6px;
      height: 20px;
      margin-left: 8px;
      color: var(--icon--angle-right-color);

      @media (min-width: $screen-lg) {
        margin-left: 10px;
      }
    }
  }

  &_opened {
    display: block;
  }
}

.header-catalog {
  --link-background-color: hsl(0, 0%, 100%);
  --link-border-radius: 0;
  --link-padding: 6px 8px;
  --link-color: hsl(198, 23%, 19%);
  --link-outline-color: transparent;
  --icon--angle-right-color: hsl(199, 22%, 77%);

  display: none;
  padding: 0;
  overflow-y: scroll;
  list-style: none;
  background-color: hsl(0, 0%, 100%);
  transition: height 0.3s;

  &__item {
    @media (min-width: $screen-lg) {
      --link-padding: 7px 20px;
    }

    &:hover,
    &--active {
      --link-background-color: hsl(230, 78%, 51%);
      --link-color: hsl(0, 0%, 100%);
      --link-outline-color: hsl(230, 78%, 51%);
      --icon--angle-right-color: hsl(0, 0%, 100%);
    }

    &:first-child {
      margin-top: 10px;

      @media (min-width: $screen-lg) {
        --link-padding: 16px 20px 10px 20px;
      }
    }

    &:last-child {
      @media (min-width: $screen-lg) {
        --link-padding: 10px 20px 16px 20px;
      }
    }
  }

  &__link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: var(--link-padding);
    font-family: $font-family-montserrat;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: var(--link-color);
    cursor: pointer;
    background-color: var(--link-background-color);
    border: 1px solid transparent;
    border-radius: var(--link-border-radius);
    outline: none;
    -webkit-tap-highlight-color: transparent;

    @media (min-width: $screen-lg) {
      outline: 3px solid var(--link-outline-color);
    }

    &_highlighted {
      font-size: 15px;
      font-weight: 500;
      color: hsl(230, 54%, 47%);
      background-color: initial;
    }
  }

  &__icon {
    flex-shrink: 0;

    &--angle-right {
      width: 6px;
      height: 20px;
      margin-left: 8px;
      color: var(--icon--angle-right-color);

      @media (min-width: $screen-lg) {
        margin-left: 10px;
      }
    }
  }

  &_opened {
    display: block;
  }
}
</style>
