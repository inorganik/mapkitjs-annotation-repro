import './style.css'
import mapMarker from './map-pin.svg'


const mapKitJsLoadedPromise = new Promise(resolve => {
  const element = document.createElement('script');
  element.addEventListener('load', resolve, { once : true });
  element.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
  element.crossOrigin = 'anonymous';
  element.setAttribute('data-libraries', 'map,annotations,overlays,user-location')
  element.setAttribute('data-initial-token', import.meta.env.VITE_MAPKIT_TOKEN)
  document.head.appendChild(element);
});

mapKitJsLoadedPromise.then(() => {
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
})