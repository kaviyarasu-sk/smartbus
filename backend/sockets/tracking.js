export default function setupTracking(io) {
  // Predefined route coordinates (e.g. Pollachi to Coimbatore area)
  const route = [
    { lat: 10.6558, lng: 77.0090 },
    { lat: 10.7000, lng: 77.0150 },
    { lat: 10.7500, lng: 77.0200 },
    { lat: 10.8000, lng: 77.0300 },
    { lat: 10.8500, lng: 77.0400 },
    { lat: 10.9000, lng: 77.0500 },
    { lat: 10.9500, lng: 77.0600 },
    { lat: 11.0168, lng: 76.9558 } // Coimbatore
  ];

  let currentIndex = 0;
  let direction = 1;

  setInterval(() => {
    const pos = route[currentIndex];
    
    io.emit('busLocationUpdate', {
      busId: 'bus-1',
      routeName: 'Pollachi - Coimbatore',
      lat: pos.lat,
      lng: pos.lng,
      speed: 45 + Math.floor(Math.random() * 10),
      status: 'ON TIME',
      timestamp: new Date()
    });

    currentIndex += direction;
    if (currentIndex >= route.length - 1 || currentIndex <= 0) {
      direction *= -1; // Reverse direction at ends
    }
  }, 3000); // Update every 3 seconds for demo
}
