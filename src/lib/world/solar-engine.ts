// Solar Position Algorithm (Simplified SPA)
// Calculates the true position of the sun based on latitude, longitude, and current Date.
// Automatically accounts for daylight savings and time of year because the JS Date object 
// translates the local time into UTC coordinates natively.

export interface SolarState {
  elevation: number;       // Sun altitude in degrees (0 = horizon, 90 = zenith, negative = night)
  azimuth: number;         // Sun compass direction in degrees (0 = North, 90 = East, 180 = South)
  isDaytime: boolean;
  isGoldenHour: boolean;
  skyColor: string;
  ambientIntensity: number;
}

// Convert degrees to radians
const rad = (deg: number) => (deg * Math.PI) / 180;
// Convert radians to degrees
const deg = (rad: number) => (rad * 180) / Math.PI;

export class SolarEngine {
  private lat: number = 37.7749; // Default: San Francisco
  private lon: number = -122.4194;

  constructor() {
    this.requestGeolocation();
  }

  private requestGeolocation() {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.lat = pos.coords.latitude;
          this.lon = pos.coords.longitude;
          console.log(`[SolarEngine] Tracking true sun trajectory at Lat: ${this.lat}, Lon: ${this.lon}`);
          // Force a React re-render or global update if necessary
          window.dispatchEvent(new Event("chronicles_solar_update"));
        },
        (err) => {
          console.warn("[SolarEngine] Geolocation denied or unavailable. Using default coordinates.", err);
        }
      );
    }
  }

  /**
   * Calculates the exact trajectory of the sun
   */
  public calculateSolarPosition(date: Date = new Date()): { elevation: number; azimuth: number } {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();

    // Fractional year in radians
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const fractionalYear = (2 * Math.PI / 365) * (dayOfYear - 1 + (hour - 12) / 24);

    // Equation of time (in minutes)
    const eqTime = 229.18 * (
      0.000075 + 
      0.001868 * Math.cos(fractionalYear) - 
      0.032077 * Math.sin(fractionalYear) - 
      0.014615 * Math.cos(2 * fractionalYear) - 
      0.040849 * Math.sin(2 * fractionalYear)
    );

    // Solar declination angle (in radians)
    const declination = 0.006918 - 
      0.399912 * Math.cos(fractionalYear) + 
      0.070257 * Math.sin(fractionalYear) - 
      0.006758 * Math.cos(2 * fractionalYear) + 
      0.000907 * Math.sin(2 * fractionalYear) - 
      0.002697 * Math.cos(3 * fractionalYear) + 
      0.00148 * Math.sin(3 * fractionalYear);

    // True solar time in minutes
    const timeOffset = eqTime + 4 * this.lon;
    const tst = hour * 60 + minute + second / 60 + timeOffset;

    // Solar hour angle (in degrees) -> converted to radians
    const haDegrees = (tst / 4) - 180;
    const ha = rad(haDegrees);
    const latRad = rad(this.lat);

    // Solar Zenith Angle (radians)
    const zenithRad = Math.acos(
      Math.sin(latRad) * Math.sin(declination) + 
      Math.cos(latRad) * Math.cos(declination) * Math.cos(ha)
    );

    // Solar Elevation (altitude) in degrees
    const elevation = 90 - deg(zenithRad);

    // Solar Azimuth Angle (radians)
    const azDenominator = Math.cos(latRad) * Math.sin(zenithRad);
    let azimuthRad;
    
    // Prevent division by zero at perfectly straight overhead
    if (Math.abs(azDenominator) > 0.001) {
      const azCos = (Math.sin(latRad) * Math.cos(zenithRad) - Math.sin(declination)) / azDenominator;
      // Clamp between -1 and 1 just in case of float precision issues
      const clampedAzCos = Math.max(-1, Math.min(1, azCos));
      azimuthRad = Math.acos(clampedAzCos);
    } else {
      azimuthRad = 0;
    }

    if (haDegrees > 0) {
      azimuthRad = (2 * Math.PI) - azimuthRad;
    }

    const azimuth = (deg(azimuthRad) + 180) % 360;

    return { elevation, azimuth };
  }

  public getSolarState(date: Date = new Date(), era: string = "modern"): SolarState {
    const { elevation, azimuth } = this.calculateSolarPosition(date);

    const isDaytime = elevation > -6; // Civil twilight threshold
    const isGoldenHour = elevation > -2 && elevation <= 12;

    let skyColor = "#000000";
    let ambientIntensity = 0.1;

    if (elevation > 15) {
      // High Daytime
      skyColor = era === "modern" ? "#87CEEB" : era === "wildwest" ? "#FDB813" : "#6f9fd8";
      ambientIntensity = 0.8;
    } else if (elevation > -2 && elevation <= 15) {
      // Golden Hour / Sunset / Sunrise
      skyColor = "#FF7E00"; 
      ambientIntensity = 0.5;
    } else if (elevation > -18 && elevation <= -2) {
      // Twilight
      skyColor = "#1a1c2c";
      ambientIntensity = 0.2;
    } else {
      // Deep Night
      skyColor = "#0a0b10";
      ambientIntensity = 0.05;
    }

    return { elevation, azimuth, isDaytime, isGoldenHour, skyColor, ambientIntensity };
  }
}

export const solarEngine = new SolarEngine();
