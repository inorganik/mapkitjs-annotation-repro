import './style.css'
import mapMarker from './map-pin.svg'

if (!window.mapkit || window.mapkit.loadedLibraries.length === 0) {
  // mapkit.core.js or the libraries are not loaded yet.
  // Set up the callback and wait for it to be called.
  await new Promise((resolve) => {
    window.initMapKit = resolve
  })
  delete window.initMapKit
}

mapkit.init({
  authorizationCallback: function (done) {
    // todo: get jwt token from server
    done(PUBLIC_MAPKIT_TOKEN)
  }
})

console.log('mapkit loaded')
let map
let mapSpan

map = new mapkit.Map('map', {
  showsCompass: mapkit.FeatureVisibility.Hidden,
  showsMapTypeControl: false,
  isRotationEnabled: false,
  showsUserLocationControl: true,
})
map.showsZoomControls = false
map._allowWheelToZoom = true
map.addEventListener('region-change-end', (event) => {
  mapSpan = map.region.span.latitudeDelta
})

// todo: different starting region for different locales
const usaCoord = new mapkit.Coordinate(39.298672726513274, -95.22146748190129)
const usaRegion = new mapkit.CoordinateRegion(
  usaCoord,
  new mapkit.CoordinateSpan(82.57, 82.57)
)
map.region = usaRegion

// TEST TO ADD MARKER
// this works
createMarker({ lat: 40.01499, lng: -105.27055, name: 'Boulder' })

setTimeout(() => {
  createMarker({ lat: 39.45804, lng: -104.89609, name: 'Castle Pines' })
}, 5000)

function createMarker(city) {
  const coord = new mapkit.Coordinate(Number(city.lat), Number(city.lng))
  console.log('create marker', coord);
  const annotation = new mapkit.MarkerAnnotation(coord, { title: city.name })
  const imgAnnotation = new mapkit.ImageAnnotation(coord, {
    title: city.name,
    url: { 1: mapMarker },
    anchorOffset: new DOMPoint(0, -17)
  })
  // map.addAnnotation(annotation)
  map.addAnnotation(imgAnnotation)
}
