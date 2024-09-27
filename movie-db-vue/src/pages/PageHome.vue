<template>
    <q-page class="text-grey-1 constrain">
        <div class="row no-wrap" style="min-height:100vh">
            <div class="search bg-grey-9 q-pa-sm q-mr-sm">Volet de recherche</div>
            <div class="bg-grey-9 q-pa-sm" style="width:100%">
                <div class="text-h6 q-mb-sm">Résultats :</div>
                <q-card v-for="(movie, idx) in search_results" :key="idx" class="my-card bg-grey-8 q-mb-sm" flat
                    bordered>
                    <dic class="row no-wrap">
                        <div class="img-container">
                            <q-img class="col-5" style="width: 100px;" fit="fill" :src="movie.poster_url" />
                        </div>
                        <div class="q-ma-sm">
                            <div class="row items-center q-mb-xs">
                                <div class="movie-title text-bold">{{ movie.title }}</div>
                                <!-- Dans la db récupérer de meilleures dates -->
                                <div class="text-caption text-bold text-italic text-grey-5 q-ml-md">{{
                                    movie.folder_name.slice(-6) }}</div>
                            </div>
                            <!-- TODO: -->
                            <div class="q-mb-sm">Ici sera une liste de genres</div>
                            <div class="movie-overview ellipsis-2-lines q-mb-sm">{{ movie.overview }}</div>
                            <!-- TODO -->
                            <div class="self-end">Ici sera la liste d'acteurs pricipaux</div>
                        </div>
                    </dic>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'PageHome',
    props: {
        term: {
            type: String,
            default: ''
        }
    },
    setup () {
        return {
            //
        }
    },
    data () {
        return {
            all_movies: [],
            search_results: []
        }
    },
    watch: {
        term () {
            if (this.all_movies.length > 0) this.searchMovies()
        }
    },
    mounted () {
        this.loadMovies()
    },
    methods: {
        loadMovies () {
            fetch('/database/movies_data.json')
                .then((res) => res.json())
                .then((data) => {
                    this.all_movies = data
                    console.log(this.all_movies)
                    this.searchMovies()
                })
        },
        searchMovies () {
            if (!this.term) this.search_results = this.all_movies
            else {
                this.search_results = this.all_movies.filter((movie) => {
                    return movie.title.toLowerCase().includes(this.term.toLowerCase()) || movie.overview.toLowerCase().includes(this.term.toLowerCase())
                })
            }
            console.log(this.search_results)
        }
    }
})
</script>

<style scoped>
.img-container {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search {
    min-width: 250px;
}

.movie-title {
    font-size: 20px;
    line-height: 1.1;
}
</style>
