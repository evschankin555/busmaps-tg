import axios from 'axios';
import { LatLng } from '../types/route';

export interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  type: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    country?: string;
  };
}

export async function searchAddress(query: string): Promise<SearchResult[]> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 10,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'BusMaps Telegram App',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка поиска адреса:', error);
    throw error;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<SearchResult | null> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'BusMaps Telegram App',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка обратного геокодирования:', error);
    return null;
  }
}

export function searchResultToLatLng(result: SearchResult): LatLng {
  return {
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
  };
}

