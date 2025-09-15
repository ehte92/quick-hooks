'use client';

import React, { useState, useEffect, useMemo } from 'react';

import {
  MapPin,
  Navigation,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Compass,
  Gauge,
  Clock,
  Target,
  Globe,
  Satellite
} from 'lucide-react';

import CodeBlock from '@/components/code-block';
import LayoutPage from '@/components/layout-page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import useGeolocation from '@/hooks/useGeolocation';

export default function UseGeolocationPage() {
  // Demo 1: Basic Geolocation
  const [enableHighAccuracy, setEnableHighAccuracy] = useState(false);
  const [timeoutMs, setTimeoutMs] = useState(10000);
  const [maximumAge, setMaximumAge] = useState(60000);

  const basicOptions = useMemo(() => ({
    enableHighAccuracy,
    timeout: timeoutMs,
    maximumAge,
  }), [enableHighAccuracy, timeoutMs, maximumAge]);

  const {
    loading: basicLoading,
    latitude,
    longitude,
    accuracy,
    altitude,
    heading,
    speed,
    timestamp,
    error: basicError,
    refresh: basicRefresh,
  } = useGeolocation(basicOptions);

  // Demo 2: Position Watching
  const [isWatching, setIsWatching] = useState(false);
  const [watchHistory, setWatchHistory] = useState<Array<{
    lat: number;
    lng: number;
    timestamp: number;
    accuracy: number;
  }>>([]);

  const watchOptions = useMemo(() => ({
    enableHighAccuracy: true,
    maximumAge: 1000
  }), []);

  const {
    loading: watchLoading,
    latitude: watchLat,
    longitude: watchLng,
    accuracy: watchAccuracy,
    timestamp: watchTimestamp,
    error: watchError,
    watchId,
  } = useGeolocation(watchOptions, isWatching);

  // Update watch history when position changes
  useEffect(() => {
    if (!watchLoading && watchLat && watchLng && isWatching) {
      setWatchHistory(prev => [
        {
          lat: watchLat,
          lng: watchLng,
          timestamp: watchTimestamp || Date.now(),
          accuracy: watchAccuracy || 0,
        },
        ...prev.slice(0, 9) // Keep last 10 positions
      ]);
    }
  }, [watchLat, watchLng, watchTimestamp, watchAccuracy, watchLoading, isWatching]);

  // Demo 3: Distance Calculator
  const [savedPositions, setSavedPositions] = useState<Array<{
    name: string;
    lat: number;
    lng: number;
    timestamp: number;
  }>>([]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const saveCurrentPosition = () => {
    if (latitude && longitude) {
      const name = `Position ${savedPositions.length + 1}`;
      setSavedPositions(prev => [...prev, {
        name,
        lat: latitude,
        lng: longitude,
        timestamp: timestamp || Date.now(),
      }]);
    }
  };

  // Helper functions
  const formatCoordinate = (coord: number | null, type: 'lat' | 'lng') => {
    if (coord === null) return 'Unknown';
    const direction = type === 'lat'
      ? (coord >= 0 ? 'N' : 'S')
      : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(6)}° ${direction}`;
  };

  const formatTimestamp = (ts: number | null) => {
    if (!ts) return 'Unknown';
    return new Date(ts).toLocaleTimeString();
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(2)}km`;
  };

  return (
    <LayoutPage
      title="useGeolocation"
    >
      <div className="space-y-6">
        <Heading level={2}>Features</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Position Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Get current location with all coordinate data
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Satellite className="h-4 w-4" />
                Watch Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Real-time location tracking with continuous updates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Error Handling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Comprehensive error handling for all scenarios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SSR Safe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Works safely in server-side rendering environments
              </p>
            </CardContent>
          </Card>
        </div>

        <Heading level={2}>Interactive Examples</Heading>

        {/* Demo 1: Basic Geolocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Basic Geolocation
            </CardTitle>
            <CardDescription>
              Get current position with configurable options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  id="high-accuracy"
                  checked={enableHighAccuracy}
                  onCheckedChange={setEnableHighAccuracy}
                />
                <Label htmlFor="high-accuracy" className="text-sm">
                  High Accuracy
                </Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Timeout (ms)</Label>
                <select
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(Number(e.target.value))}
                  className="w-full p-1 text-sm border rounded"
                >
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                  <option value={15000}>15 seconds</option>
                  <option value={30000}>30 seconds</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Age (ms)</Label>
                <select
                  value={maximumAge}
                  onChange={(e) => setMaximumAge(Number(e.target.value))}
                  className="w-full p-1 text-sm border rounded"
                >
                  <option value={0}>No cache</option>
                  <option value={30000}>30 seconds</option>
                  <option value={60000}>1 minute</option>
                  <option value={300000}>5 minutes</option>
                </select>
              </div>
            </div>

            {/* Status and Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {basicLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : basicError ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <span className="text-sm font-medium">
                  {basicLoading ? 'Loading...' : basicError ? 'Error' : 'Success'}
                </span>
              </div>

              <Button
                onClick={basicRefresh}
                disabled={basicLoading}
                variant="neutral"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Error Display */}
            {basicError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error Code {basicError.code}</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{basicError.message}</p>
              </div>
            )}

            {/* Position Data */}
            {!basicError && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Latitude:</span>
                      <span className="font-mono">{formatCoordinate(latitude, 'lat')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Longitude:</span>
                      <span className="font-mono">{formatCoordinate(longitude, 'lng')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-mono">
                        {accuracy ? `±${accuracy.toFixed(0)}m` : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    Additional Data
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Altitude:</span>
                      <span className="font-mono">
                        {altitude ? `${altitude.toFixed(0)}m` : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Heading:</span>
                      <span className="font-mono">
                        {heading ? `${heading.toFixed(0)}°` : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-mono">
                        {speed ? `${speed.toFixed(1)}m/s` : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {timestamp && (
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Last updated: {formatTimestamp(timestamp)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo 2: Position Watching */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Real-time Position Tracking
            </CardTitle>
            <CardDescription>
              Continuously monitor location changes with watchPosition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="watch-position"
                  checked={isWatching}
                  onCheckedChange={setIsWatching}
                />
                <Label htmlFor="watch-position">
                  {isWatching ? 'Stop Watching' : 'Start Watching'}
                </Label>
              </div>

              {watchId && (
                <Badge variant="neutral">
                  Watch ID: {watchId}
                </Badge>
              )}

              {isWatching && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Watching position...
                </div>
              )}
            </div>

            {watchError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{watchError.message}</p>
              </div>
            )}

            {isWatching && watchLat && watchLng && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Current Position</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Latitude:</span>
                    <span className="ml-2 font-mono">{formatCoordinate(watchLat, 'lat')}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Longitude:</span>
                    <span className="ml-2 font-mono">{formatCoordinate(watchLng, 'lng')}</span>
                  </div>
                </div>
              </div>
            )}

            {watchHistory.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Position History</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {watchHistory.map((pos, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-muted rounded text-sm"
                    >
                      <div className="font-mono">
                        {formatCoordinate(pos.lat, 'lat')}, {formatCoordinate(pos.lng, 'lng')}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {formatTimestamp(pos.timestamp)} (±{pos.accuracy.toFixed(0)}m)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo 3: Distance Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Distance Calculator
            </CardTitle>
            <CardDescription>
              Save positions and calculate distances between them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={saveCurrentPosition}
                disabled={!latitude || !longitude}
                size="sm"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Save Current Position
              </Button>

              {savedPositions.length > 0 && (
                <Button
                  onClick={() => setSavedPositions([])}
                  variant="neutral"
                  size="sm"
                >
                  Clear All
                </Button>
              )}
            </div>

            {savedPositions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Saved Positions</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Coordinates</TableHead>
                      <TableHead>Distance from Current</TableHead>
                      <TableHead>Saved At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedPositions.map((pos, index) => {
                      const distance = latitude && longitude
                        ? calculateDistance(latitude, longitude, pos.lat, pos.lng)
                        : null;

                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{pos.name}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {formatCoordinate(pos.lat, 'lat')}<br/>
                            {formatCoordinate(pos.lng, 'lng')}
                          </TableCell>
                          <TableCell>
                            {distance !== null ? (
                              <Badge variant="neutral">
                                {formatDistance(distance)}
                              </Badge>
                            ) : (
                              'Unknown'
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {formatTimestamp(pos.timestamp)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Heading level={2}>Usage</Heading>

        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`import useGeolocation from '@/hooks/useGeolocation'

function LocationComponent() {
  const {
    loading,
    latitude,
    longitude,
    accuracy,
    error,
    refresh,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  })

  if (loading) return <div>Getting your location...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h3>Your Location</h3>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Accuracy: ±{accuracy}m</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  )
}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Watching</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`import useGeolocation from '@/hooks/useGeolocation'
import { useState } from 'react'

function LocationTracker() {
  const [isTracking, setIsTracking] = useState(false)

  const {
    latitude,
    longitude,
    error,
    watchId,
  } = useGeolocation(
    { enableHighAccuracy: true },
    isTracking // Enable watching
  )

  return (
    <div>
      <button onClick={() => setIsTracking(!isTracking)}>
        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>

      {watchId && <p>Watch ID: {watchId}</p>}

      {latitude && longitude && (
        <p>Current: {latitude}, {longitude}</p>
      )}

      {error && <p>Error: {error.message}</p>}
    </div>
  )
}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><code>options</code></TableCell>
                  <TableCell><code>PositionOptions</code></TableCell>
                  <TableCell>Geolocation API options (optional)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><code>watch</code></TableCell>
                  <TableCell><code>boolean</code></TableCell>
                  <TableCell>Enable real-time watching (default: false)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Returns</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell><code>loading</code></TableCell>
                    <TableCell><code>boolean</code></TableCell>
                    <TableCell>Whether location is being fetched</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>latitude</code></TableCell>
                    <TableCell><code>number | null</code></TableCell>
                    <TableCell>Latitude coordinate</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>longitude</code></TableCell>
                    <TableCell><code>number | null</code></TableCell>
                    <TableCell>Longitude coordinate</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>accuracy</code></TableCell>
                    <TableCell><code>number | null</code></TableCell>
                    <TableCell>Accuracy in meters</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>error</code></TableCell>
                    <TableCell><code>GeolocationPositionError | null</code></TableCell>
                    <TableCell>Error object if request failed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>refresh</code></TableCell>
                    <TableCell><code>() =&gt; void</code></TableCell>
                    <TableCell>Function to refresh location</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><code>watchId</code></TableCell>
                    <TableCell><code>number | null</code></TableCell>
                    <TableCell>Watch ID when watching position</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutPage>
  );
}