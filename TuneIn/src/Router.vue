import Playlist from './components/Playlist'

const router = new VueRouter();

router.map({
  'playlist/:id' : {
    component: {
      Playlist
    }
  }
});