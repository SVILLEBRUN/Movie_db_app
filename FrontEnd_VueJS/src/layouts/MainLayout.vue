<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-black text-grey-1"
      bordered
    >
      <div class="row no-wrap constrain">
        <q-toolbar class="col-10">
          <q-toolbar-title class="text-anuphan">MES FILMS</q-toolbar-title>
          <div style="width:500px">
            <q-input v-model="term" rounded outlined dense bg-color="grey-4" placeholder="Rechercher" debounce="200">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </q-toolbar>
        <q-toolbar class="col-2">
          <!-- Ajouter des options si besoin -->
        </q-toolbar>
      </div>
    </q-header>
    <q-page-container class="bg-grey-10 q-mt-sm">
      <router-view :term="term" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      term: ''
    }
  }
})
</script>

<style lang="sass">
.q-toolbar
  height: 60px
  padding: 0 50px

.q-toolbar__title
  font-size: 30px

.q-footer
  height: 60px

</style>
