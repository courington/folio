<script lang="ts">
	import linkedinLogo from '$lib/images/linkedin.svg';
	import githubLogo from '$lib/images/github.svg';

	import mapboxgl, { Map, Popup, type MapEventType, } from 'mapbox-gl';
	import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import { onMount, onDestroy } from 'svelte';
	import type { FeatureCollection, Point } from 'geojson';

	const accessToken = 'pk.eyJ1IjoiY2hhY28iLCJhIjoiY2xyYzl1MWZ1MHlnNTJrbGhyYTk3Z282YyJ9.oJgUelWpn0B4DY6sfNyY0Q';

	let map: Map | undefined;
	let mapContainer: string | HTMLElement;
	let lng: number,
		lat: number,
		zoom: number;

	const _lng = -105.3254;
	const _lat = 39.6319;

	lng = _lng;
	lat = _lat;
	zoom = 13;

	let contextPopup: mapboxgl.Popup;

	const placesGeoJson: FeatureCollection = {
		'type': 'FeatureCollection',
		'features': [
			{
				'type': 'Feature',
				'properties': {
					'description':
						'<strong>Home Office</strong><p><a href="https://en.wikipedia.org/wiki/Evergreen,_Colorado" target="_blank" title="Opens Wikipedia entry for Evergreen, CO">Evergreen, CO</a> is where I live, work, and play. Easy access to Denver, world class skiing, and all the outdoor activities steps from home.</p>',
					'icon': 'castle',
				},
				'geometry': {
					'type': 'Point',
					'coordinates': [-105.3254, 39.6319]
				}
			},
		]
	};

	onMount(() => {
		const initialState = { lng: lng, lat: lat, zoom: zoom };

		map = new Map({
			container: mapContainer,
			accessToken: `${accessToken}`,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
		});

		map.on('load', (event) => {
			if (!map) return;

			// add the digital elevation model tiles
            map.addSource('mapbox-dem', {
                type: 'raster-dem',
                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                tileSize: 512,
                maxzoom: 20
            });
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1 });

			map.addSource('places', {
				'type': 'geojson',
				'data': placesGeoJson,
			});
			// Add a layer showing the places.
			map.addLayer({
				'id': 'places',
				'type': 'symbol',
				'source': 'places',
				'layout': {
					'icon-image': ['get', 'icon'],
					'icon-size': 2,
					// 'icon-halo-color': 'rgba(255, 100, 100, 1)',
					'icon-allow-overlap': true
				}
			});
			
			// map.on('click', (e) => {
			// 	handleMapClick(e);
			// });

			map.on('contextmenu', (event) => {
				if (contextPopup) contextPopup.remove();
				
				const lngLat = event.lngLat;
				const queryElev = map?.queryTerrainElevation(lngLat, { exaggerated: false });
				const elevation = Math.floor((queryElev || 0) * 3.28084);

				contextPopup = new Popup()
					.setLngLat(lngLat)
					.setHTML(`${elevation}ft above sea level`)
					.addTo(event.target);
			});

			map.on('click', 'places', (e) => {
				if (!e.features?.length) return;
				// Copy coordinates array.
				const coordinates = (e.features[0].geometry as Point)?.coordinates.slice();
				const description = e.features[0]?.properties?.description;

				// Ensure that if the map is zoomed out such that multiple
				// copies of the feature are visible, the popup appears
				// over the copy being pointed to.
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				new Popup()
					.setLngLat(coordinates as mapboxgl.LngLatLike)
					.setHTML(description)
					.addTo(e.target);
			});

			// Change the cursor to a pointer when the mouse is over the places layer.
			map.on('mouseenter', 'places', (e) => {
				e.target.getCanvas().style.cursor = 'pointer';
			});

			// Change it back to a pointer when it leaves.
			map.on('mouseleave', 'places', (e) => {
				e.target.getCanvas().style.cursor = '';
			});
		});

		map.on('move', (event) => {
			updateData(event.target);
		});
	});

	onDestroy(() => {
		map?.remove();
	});

	// function handleMapClick(event: MapEventType["click"]) {
	// 	console.log(`A click event has occurred at ${event.lngLat}`);
	// }

	function updateData(map: Map) {
		zoom = map.getZoom();
		lng = map.getCenter().lng;
		lat = map.getCenter().lat;	
	}
</script>

<svelte:head>
	<title>Chase Courington - Software Engineer</title>
	<meta name="description" content="Chase Courington - CV" />
</svelte:head>

<section>
	<header class="sidebar">
		<h1>Chase Courington</h1>
		<small>
			<a href="https://www.linkedin.com/in/chasecourington/" title="Chase's LinkedIn">
				<img src={linkedinLogo} alt="linkedin logo" height="15" width="15" />
			</a>
			<a href="https://github.com/courington/" title="Chase's Github">
				<img src={githubLogo} alt="github logo" height="18" width="18" />
			</a>
		</small>
		<h2>Software Engineer - Evergreen, CO</h2>
		<h3>Lng: {lng?.toFixed(2)} | Lat: {lat?.toFixed(2)} | Z: {zoom?.toFixed(1)}</h3>
	</header>

	<div class="map-wrap">
		<div class="map" bind:this={mapContainer} />
	</div>
</section>

<style>
	h1 {
		font-family: var(--font-body);
		font-size: 1.625rem;
		font-weight: bold;
		margin: .5rem 0;
	}

	small {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	h3 {
		font-weight: lighter;
	}

	.map {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.sidebar {
		background-color: rgb(35 55 75 / 90%);
		color: #fff;
		padding: 6px 12px;
		font-family: monospace;
		z-index: 1;
		position: absolute;
		bottom: 0;
		left: 0;
		margin: 12px;
		border-radius: 4px;
	}
</style>
