# Travel Time Service

This module provides an abstraction layer for calculating travel time between coordinates using various routing APIs.

## Architecture

The travel time service uses a provider pattern to allow easy swapping of routing APIs without changing application code.

### Components

1. **TravelTimeProvider** (Abstract Interface)
   - Defines the contract for all routing providers
   - Provides validation utilities
   - Located in `TravelTimeProvider.js`

2. **OSRMProvider** (Concrete Implementation)
   - Uses the public OSRM (Open Source Routing Machine) API
   - No API key required
   - Supports driving, walking, and cycling
   - Located in `OSRMProvider.js`

3. **Factory** (Service Configuration)
   - Provides configured provider instances
   - Allows provider selection via environment variables
   - Located in `index.js`

## Usage

### Basic Usage

```javascript
const { getTravelTimeProvider } = require('./services/travelTime');

const provider = getTravelTimeProvider();

const result = await provider.getTravelTime(
  40.7128, -74.0060,  // Start: New York City
  34.0522, -118.2437, // End: Los Angeles
  'driving'
);

console.log(`Duration: ${result.durationMinutes} minutes`);
console.log(`Distance: ${result.distanceKm} km`);
```

### Using Utility Functions

```javascript
const { calculateTravelTime } = require('./utils/travelTime');

const result = await calculateTravelTime(
  40.7128, -74.0060,
  34.0522, -118.2437,
  'driving'
);
```

### Travel Modes

Supported travel modes:
- `'driving'` - Car/automobile routing
- `'walking'` - Pedestrian routing
- `'cycling'` - Bicycle routing

## Configuration

Configure the provider via environment variables:

```bash
# Provider selection (default: osrm)
TRAVEL_TIME_PROVIDER=osrm

# OSRM-specific configuration
OSRM_BASE_URL=https://router.project-osrm.org
OSRM_TIMEOUT=10000
```

## Adding New Providers

To add a new routing provider (e.g., Google Maps, GraphHopper):

1. Create a new provider class extending `TravelTimeProvider`:

```javascript
const TravelTimeProvider = require('./TravelTimeProvider');

class GoogleMapsProvider extends TravelTimeProvider {
  constructor(config) {
    super();
    this.apiKey = config.apiKey;
  }

  async getTravelTime(startLat, startLon, endLat, endLon, travelMode) {
    // Implement using Google Maps API
    // ...
  }
}

module.exports = GoogleMapsProvider;
```

2. Register the provider in `index.js`:

```javascript
case 'google':
  providerInstance = new GoogleMapsProvider({ 
    apiKey: process.env.GOOGLE_MAPS_API_KEY 
  });
  break;
```

3. Set the environment variable:

```bash
TRAVEL_TIME_PROVIDER=google
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Error Handling

All providers throw descriptive errors:

```javascript
try {
  const result = await provider.getTravelTime(lat1, lon1, lat2, lon2, 'driving');
} catch (error) {
  // Errors include:
  // - Invalid coordinates
  // - Invalid travel mode
  // - API failures
  // - Network timeouts
  // - No route found
  console.error('Travel time calculation failed:', error.message);
}
```

## OSRM Provider Details

### API Endpoint

Uses the public OSRM demo server: `https://router.project-osrm.org`

### Rate Limits

The public OSRM server has rate limits. For production use, consider:
- Self-hosting OSRM
- Using a commercial OSRM provider
- Implementing caching
- Switching to a different provider

### Profiles

OSRM profiles mapped to travel modes:
- `driving` → `car`
- `walking` → `foot`
- `cycling` → `bike`

### Response Format

Returns:
```javascript
{
  durationMinutes: 45,  // Rounded to nearest minute
  distanceKm: 12.3      // Rounded to 1 decimal place
}
```

## Fallback Utilities

The `utils/travelTime.js` module provides fallback functions:

- `calculateStraightLineDistance()` - Haversine formula for straight-line distance
- `estimateTravelTimeFromDistance()` - Rough time estimate from distance

These can be used when the routing API is unavailable.

## Testing

```javascript
const { resetProvider } = require('./services/travelTime');

// Reset provider between tests
beforeEach(() => {
  resetProvider();
});
```

## Future Enhancements

Potential improvements:
- Response caching
- Batch route calculations
- Alternative route options
- Traffic-aware routing
- Multi-modal routing
- Route geometry/polylines
