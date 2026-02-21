import {
  SearchRiseSet,
  Body,
  Observer,
  Equator,
  Horizon,
  Illumination,
  MoonPhase,
  Seasons,
  MakeTime,
  Ecliptic,
  GeoVector,
  RotationMatrix,
  Vector,
  SiderealTime
} from 'astronomy-engine';

// Coordinates for major cities (Mock Geocoding)
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  istanbul: { lat: 41.0082, lon: 28.9784 },
  ankara: { lat: 39.9334, lon: 32.8597 },
  izmir: { lat: 38.4192, lon: 27.1287 },
  bursa: { lat: 40.1885, lon: 29.0610 },
  antalya: { lat: 36.8969, lon: 30.7133 },
  // Default fallback
  default: { lat: 41.0082, lon: 28.9784 },
};

function getCoordinates(place: string): { lat: number; lon: number } {
  const key = place.toLowerCase().trim().split(' ')[0]; // Simple match
  return CITY_COORDINATES[key] || CITY_COORDINATES.default;
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function getSignFromLongitude(longitude: number): string {
  // Normalize longitude to 0-360
  let lon = longitude % 360;
  if (lon < 0) lon += 360;

  const index = Math.floor(lon / 30);
  return ZODIAC_SIGNS[index];
}

export interface NatalChart {
  sun: string;
  moon: string;
  mercury: string;
  venus: string;
  mars: string;
  rising: string | null; // Null if time is unknown
}

export function calculateNatalChart(
  dateStr: string,
  timeStr: string,
  isTimeUnknown: boolean,
  place: string
): NatalChart {
  // Parse date and time
  const dateParts = dateStr.split('-').map(Number); // YYYY-MM-DD
  const timeParts = timeStr ? timeStr.split(':').map(Number) : [12, 0]; // Default noon if unknown

  // Get Observer Coordinates
  const { lat, lon } = getCoordinates(place);
  const observer = new Observer(lat, lon, 0);

  // Convert assumed local time to true UTC using Longitude offset (15 degrees = 1 hour)
  // Timezones strictly follow geometry: Local Mean Time = UTC + (lon / 15)
  const tzOffsetHours = lon / 15;
  const localMinutes = timeParts[0] * 60 + timeParts[1];
  const utcMinutesTotal = localMinutes - (tzOffsetHours * 60);

  const utcH = Math.floor(utcMinutesTotal / 60);
  const utcM = Math.floor(utcMinutesTotal % 60);

  const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], utcH, utcM));

  // Create Astronomy Engine Time object
  const originTime = MakeTime(date);

  // Calculate Sun Position (GeoVector relative to Earth center, J2000)
  // We need Ecliptic Longitude for Zodiac Sign
  const sunVector = GeoVector(Body.Sun, originTime, false);
  const sunEcliptic = Ecliptic(sunVector);
  const sunSign = getSignFromLongitude(sunEcliptic.elon);

  // Calculate Moon Position
  const moonVector = GeoVector(Body.Moon, originTime, false);
  const moonEcliptic = Ecliptic(moonVector);
  const moonSign = getSignFromLongitude(moonEcliptic.elon);

  // Calculate Mercury
  const mercuryVector = GeoVector(Body.Mercury, originTime, false);
  const mercuryEcliptic = Ecliptic(mercuryVector);
  const mercurySign = getSignFromLongitude(mercuryEcliptic.elon);

  // Calculate Venus
  const venusVector = GeoVector(Body.Venus, originTime, false);
  const venusEcliptic = Ecliptic(venusVector);
  const venusSign = getSignFromLongitude(venusEcliptic.elon);

  // Calculate Mars
  const marsVector = GeoVector(Body.Mars, originTime, false);
  const marsEcliptic = Ecliptic(marsVector);
  const marsSign = getSignFromLongitude(marsEcliptic.elon);

  // Calculate Rising Sign (Ascendant)
  // This requires calculation of the intersection of the Ecliptic and the Horizon at the East.
  let risingSign: string | null = null;

  if (!isTimeUnknown) {
    // Implement standard astrological geometry for the Ascendant (Eastern Horizon intersection with Ecliptic)
    // Formula: ASC = atan2(cos(LST), -sin(LST)*cos(Eps) - tan(Lat)*sin(Eps))
    const gstHours = SiderealTime(originTime);
    let lstHours = gstHours + (lon / 15);
    let lstRad = (lstHours * 15) * Math.PI / 180;

    const epsRad = 23.4392911 * Math.PI / 180; // Obliquity of Ecliptic
    const latRad = lat * Math.PI / 180;

    const yVal = Math.cos(lstRad);
    const xVal = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);

    let ascRad = Math.atan2(yVal, xVal);
    let ascDeg = ascRad * 180 / Math.PI;
    if (ascDeg < 0) ascDeg += 360;

    const risingIndex = Math.floor(ascDeg / 30);
    risingSign = ZODIAC_SIGNS[risingIndex];
  }

  return {
    sun: sunSign,
    moon: moonSign,
    mercury: mercurySign,
    venus: venusSign,
    mars: marsSign,
    rising: risingSign,
  };
}
