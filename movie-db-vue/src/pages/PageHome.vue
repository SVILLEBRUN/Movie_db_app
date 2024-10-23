<template>
    <q-page class="text-grey-1 constrain">
        <div class="row no-wrap" style="min-height:100vh">
            <!-- TODO: Filtre pour le volet de recherche -->
            <div class="search bg-grey-9 q-pa-sm q-mr-sm">Volet de recherche</div>
            <div class="bg-grey-9 q-pa-sm col" style="width:100%">
                <q-card v-for="(movie, idx) in search_results" :key="idx" class="my-card bg-grey-8 q-mb-md" flat bordered>
                    <div class="row no-wrap">
                        <div class="img-container">
                            <q-img v-if="movie.poster_url" class="col-5 cursor-pointer" style="width: 100px;" fit="fill" :src="image_proxy_URL+movie.poster_url" />
                            <q-img v-else class="col-5 cursor-pointer" style="width: 100px;" fit="fill" src="images/no_poster_available.png" />
                        </div>
                        <div class="q-ma-sm overflow-hidden col" style="position: relative;">
                            <div class="row items-center q-mb-xs">
                                <div class="movie-title text-bold">{{ movie.original_title }}</div>
                                <div class="text-caption text-bold text-italic text-grey-5 q-ml-md">
									({{ date.formatDate(movie.release_date, 'YYYY') }})
								</div>
                            </div>
                            <div class="q-mb-sm text-caption text-bold text-grey-5">{{ movie.genres.join(' - ') }}</div>
                            <div class="movie-overview ellipsis-3-lines">{{ movie.overview }}</div>
							<div class="text-bold text-caption ellipsis" style="position: absolute; bottom: 0; right: 0 ; left: 0; line-height: 1;">
								<template v-for="(actor, a_idx) in movie.actors" :key="a_idx">
									<!-- TODO: lien vers la fiche acteur  -->
									<span class="actor-name">
										{{ actor.name }}
										<q-tooltip :offset="[ 0, 4 ]" v-if="actor.profile_path">
											<q-img style="width: 70px;" :src="image_proxy_URL+actor.profile_path" />
										</q-tooltip>
									</span>
									<span v-if="a_idx < movie.actors.length"> - </span>
								</template>
							</div>
                        </div>
                    </div>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { date } from 'quasar'

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
            date,
            image_proxy_URL: process.env.VUE_APP_PROXY_URL + '/images?url='
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
		// TODO faire un fichier utils avec les erreurs pour générer des notification
        this.loadMovies().catch((err) => console.log(err))
    },
    methods: {
        async loadMovies () {
			const response = await this.$api.get('/movies')
			console.log('Movies :', response.data)
			this.all_movies = response.data
			this.searchMovies()
        },
        searchMovies () {
            if (!this.term) this.search_results = this.all_movies
            else {
                this.search_results = this.all_movies.filter((movie) => {
                    return movie.original_title.toLowerCase().includes(this.term.toLowerCase()) || movie.overview.toLowerCase().includes(this.term.toLowerCase())
                })
            }
            console.log(this.search_results)
        }
    }
})
</script>

<style scoped lang="scss">
.img-container {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 158px;
}

.search {
    min-width: 250px;
}

.movie-title {
    font-size: 20px;
    line-height: 1.1;
	cursor: pointer;
	transition: color 0.3s ease, transform 0.3s ease;
}

.movie-title:hover {
	color: $grey-5;
}

.actor-name {
	cursor: pointer;
}

.actor-name:hover {
	text-decoration: underline;
}
</style>
