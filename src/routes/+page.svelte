<script lang="ts">
	import linkedinLogo from '$lib/images/linkedin.svg';
	import githubLogo from '$lib/images/github.svg';

	import { Map, Marker } from 'mapbox-gl';
	import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import { onMount, onDestroy } from 'svelte';

	let map: Map | undefined;
	let mapContainer: string | HTMLElement;
	let lng: number,
		lat: number,
		zoom: number;

	const _lng = -105.3254;
	const _lat = 39.6319;

	lng = _lng;
	lat = _lat;
	zoom = 10;

	onMount(() => {
		const initialState = { lng: lng, lat: lat, zoom: zoom };

		map = new Map({
			container: mapContainer,
			accessToken: `pk.eyJ1IjoiY2hhY28iLCJhIjoiY2xyYzl1MWZ1MHlnNTJrbGhyYTk3Z282YyJ9.oJgUelWpn0B4DY6sfNyY0Q`,
			style: `mapbox://styles/mapbox/outdoors-v11`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
		});

		map.on('load', (event) => {
			const marker = new Marker()
				.setLngLat([_lng, _lat])
				.addTo(event.target);
		})

		map.on('move', (event) => {
			updateData(event.target);
		})
	});

	onDestroy(() => {
		map?.remove();
	});

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
