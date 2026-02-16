// LiteAPI service - Real hotel booking integration

import { Hotel, HotelRate, SearchParams, SearchResult } from './types';
import { getMockHotels, getMockHotel, getMockRates } from './mock-data';

const API_BASE = 'https://api.liteapi.travel/v3.0';

function getApiKey(): string | null {
  return process.env.LITEAPI_KEY || null;
}

export function isDemoMode(): boolean {
  return !getApiKey();
}

// Get markup percentage from env (default 10%)
export function getMarkupPercent(): number {
  return parseInt(process.env.LITEAPI_MARKUP || '10');
}

// Apply markup to price
export function applyMarkup(price: number): number {
  const markup = getMarkupPercent();
  return Math.round(price * (1 + markup / 100));
}

// Strip HTML tags from description
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Transform LiteAPI response to our Hotel type
function transformHotel(apiHotel: Record<string, unknown>): Hotel {
  // Handle hotelDescription which may contain HTML
  let description = '';
  if (apiHotel.hotelDescription) {
    description = stripHtml(String(apiHotel.hotelDescription));
  } else if (apiHotel.description) {
    description = stripHtml(String(apiHotel.description));
  }

  // LiteAPI uses main_photo and thumbnail fields
  const mainPhoto = String(apiHotel.main_photo || apiHotel.thumbnail || '');
  const thumbnail = String(apiHotel.thumbnail || apiHotel.main_photo || '');

  return {
    id: String(apiHotel.id || apiHotel.hotelId || ''),
    name: String(apiHotel.name || ''),
    starRating: Number(apiHotel.stars || apiHotel.starRating || apiHotel.star || 0),
    address: String(apiHotel.address || ''),
    city: String(apiHotel.city || apiHotel.cityName || ''),
    country: String(apiHotel.country || apiHotel.countryCode || ''),
    latitude: Number(apiHotel.latitude || 0),
    longitude: Number(apiHotel.longitude || 0),
    thumbnail: thumbnail,
    images: mainPhoto ? [mainPhoto] : [],
    description: description.substring(0, 500) + (description.length > 500 ? '...' : ''),
    amenities: Array.isArray(apiHotel.amenities) ? apiHotel.amenities.map(String) : [],
    reviewScore: Number(apiHotel.rating || apiHotel.reviewScore || 0),
    reviewCount: Number(apiHotel.reviewCount || apiHotel.reviews || 0),
  };
}

// Comprehensive city to country code mapping for global destinations
const CITY_COUNTRY_MAP: Record<string, string> = {
  // South Africa
  'cape town': 'ZA', 'johannesburg': 'ZA', 'durban': 'ZA', 'pretoria': 'ZA',
  'stellenbosch': 'ZA', 'knysna': 'ZA', 'port elizabeth': 'ZA', 'gqeberha': 'ZA',
  'franschhoek': 'ZA', 'hermanus': 'ZA', 'plettenberg bay': 'ZA', 'george': 'ZA',
  'bloemfontein': 'ZA', 'east london': 'ZA', 'polokwane': 'ZA', 'nelspruit': 'ZA',
  'mpumalanga': 'ZA', 'kruger': 'ZA', 'sun city': 'ZA', 'sodwana': 'ZA',

  // United Kingdom
  'london': 'GB', 'manchester': 'GB', 'birmingham': 'GB', 'edinburgh': 'GB',
  'glasgow': 'GB', 'liverpool': 'GB', 'bristol': 'GB', 'leeds': 'GB',
  'oxford': 'GB', 'cambridge': 'GB', 'bath': 'GB', 'york': 'GB',
  'brighton': 'GB', 'cardiff': 'GB', 'belfast': 'GB', 'newcastle': 'GB',
  'nottingham': 'GB', 'sheffield': 'GB', 'southampton': 'GB', 'coventry': 'GB',

  // France
  'paris': 'FR', 'nice': 'FR', 'lyon': 'FR', 'marseille': 'FR',
  'bordeaux': 'FR', 'toulouse': 'FR', 'strasbourg': 'FR', 'cannes': 'FR',
  'montpellier': 'FR', 'nantes': 'FR', 'lille': 'FR', 'monaco': 'MC',

  // United States
  'new york': 'US', 'los angeles': 'US', 'miami': 'US', 'las vegas': 'US',
  'san francisco': 'US', 'chicago': 'US', 'boston': 'US', 'seattle': 'US',
  'washington': 'US', 'orlando': 'US', 'san diego': 'US', 'denver': 'US',
  'atlanta': 'US', 'dallas': 'US', 'houston': 'US', 'phoenix': 'US',
  'new orleans': 'US', 'nashville': 'US', 'austin': 'US', 'philadelphia': 'US',
  'portland': 'US', 'honolulu': 'US', 'hawaii': 'US', 'maui': 'US',
  'waikiki': 'US', 'fort lauderdale': 'US', 'tampa': 'US', 'savannah': 'US',

  // Canada
  'toronto': 'CA', 'vancouver': 'CA', 'montreal': 'CA', 'calgary': 'CA',
  'ottawa': 'CA', 'quebec city': 'CA', 'victoria': 'CA', 'whistler': 'CA',
  'banff': 'CA', 'niagara falls': 'CA', 'halifax': 'CA', 'edmonton': 'CA',

  // Australia
  'sydney': 'AU', 'melbourne': 'AU', 'brisbane': 'AU', 'perth': 'AU',
  'gold coast': 'AU', 'cairns': 'AU', 'adelaide': 'AU', 'hobart': 'AU',
  'darwin': 'AU', 'canberra': 'AU', 'alice springs': 'AU', 'uluru': 'AU',

  // New Zealand
  'auckland': 'NZ', 'queenstown': 'NZ', 'wellington': 'NZ', 'christchurch': 'NZ',
  'rotorua': 'NZ', 'dunedin': 'NZ', 'napier': 'NZ', 'taupo': 'NZ',

  // Germany
  'berlin': 'DE', 'munich': 'DE', 'frankfurt': 'DE', 'hamburg': 'DE',
  'cologne': 'DE', 'dusseldorf': 'DE', 'stuttgart': 'DE', 'dresden': 'DE',
  'leipzig': 'DE', 'nuremberg': 'DE', 'hanover': 'DE', 'bremen': 'DE',

  // Italy
  'rome': 'IT', 'milan': 'IT', 'venice': 'IT', 'florence': 'IT',
  'naples': 'IT', 'turin': 'IT', 'bologna': 'IT', 'amalfi': 'IT',
  'positano': 'IT', 'cinque terre': 'IT', 'sorrento': 'IT', 'sicily': 'IT',
  'palermo': 'IT', 'pisa': 'IT', 'verona': 'IT', 'siena': 'IT',

  // Spain
  'barcelona': 'ES', 'madrid': 'ES', 'seville': 'ES', 'valencia': 'ES',
  'malaga': 'ES', 'ibiza': 'ES', 'majorca': 'ES', 'mallorca': 'ES',
  'granada': 'ES', 'bilbao': 'ES', 'san sebastian': 'ES', 'tenerife': 'ES',
  'marbella': 'ES', 'costa brava': 'ES', 'alicante': 'ES', 'cordoba': 'ES',

  // Portugal
  'lisbon': 'PT', 'porto': 'PT', 'faro': 'PT', 'algarve': 'PT',
  'madeira': 'PT', 'funchal': 'PT', 'sintra': 'PT', 'cascais': 'PT',

  // Netherlands
  'amsterdam': 'NL', 'rotterdam': 'NL', 'the hague': 'NL', 'utrecht': 'NL',
  'eindhoven': 'NL', 'maastricht': 'NL', 'delft': 'NL', 'haarlem': 'NL',

  // Belgium
  'brussels': 'BE', 'bruges': 'BE', 'antwerp': 'BE', 'ghent': 'BE',

  // Switzerland
  'zurich': 'CH', 'geneva': 'CH', 'bern': 'CH', 'lucerne': 'CH',
  'interlaken': 'CH', 'zermatt': 'CH', 'basel': 'CH', 'lausanne': 'CH',

  // Austria
  'vienna': 'AT', 'salzburg': 'AT', 'innsbruck': 'AT', 'graz': 'AT',
  'hallstatt': 'AT', 'linz': 'AT', 'kitzbuhel': 'AT',

  // Greece
  'athens': 'GR', 'santorini': 'GR', 'mykonos': 'GR', 'crete': 'GR',
  'rhodes': 'GR', 'corfu': 'GR', 'thessaloniki': 'GR', 'zakynthos': 'GR',
  'paros': 'GR', 'naxos': 'GR', 'heraklion': 'GR', 'kos': 'GR',

  // Turkey
  'istanbul': 'TR', 'antalya': 'TR', 'bodrum': 'TR', 'cappadocia': 'TR',
  'izmir': 'TR', 'ankara': 'TR', 'fethiye': 'TR', 'marmaris': 'TR',

  // Croatia
  'dubrovnik': 'HR', 'split': 'HR', 'zagreb': 'HR', 'hvar': 'HR',
  'plitvice': 'HR', 'zadar': 'HR', 'rovinj': 'HR', 'pula': 'HR',

  // Czech Republic
  'prague': 'CZ', 'brno': 'CZ', 'karlovy vary': 'CZ', 'cesky krumlov': 'CZ',

  // Hungary
  'budapest': 'HU', 'debrecen': 'HU', 'szeged': 'HU',

  // Poland
  'warsaw': 'PL', 'krakow': 'PL', 'gdansk': 'PL', 'wroclaw': 'PL', 'poznan': 'PL',

  // Scandinavia
  'copenhagen': 'DK', 'stockholm': 'SE', 'oslo': 'NO', 'helsinki': 'FI',
  'reykjavik': 'IS', 'bergen': 'NO', 'gothenburg': 'SE', 'malmo': 'SE',
  'tromso': 'NO', 'lapland': 'FI', 'rovaniemi': 'FI', 'aarhus': 'DK',

  // Russia
  'moscow': 'RU', 'st petersburg': 'RU', 'saint petersburg': 'RU', 'sochi': 'RU',

  // Asia - Japan
  'tokyo': 'JP', 'kyoto': 'JP', 'osaka': 'JP', 'hiroshima': 'JP',
  'nara': 'JP', 'hakone': 'JP', 'yokohama': 'JP', 'nagoya': 'JP',
  'sapporo': 'JP', 'fukuoka': 'JP', 'okinawa': 'JP', 'kobe': 'JP',

  // Asia - China
  'beijing': 'CN', 'shanghai': 'CN', 'hong kong': 'HK', 'guangzhou': 'CN',
  'shenzhen': 'CN', 'xian': 'CN', 'chengdu': 'CN', 'hangzhou': 'CN',
  'suzhou': 'CN', 'guilin': 'CN', 'macau': 'MO', 'taipei': 'TW',

  // Asia - Southeast
  'bangkok': 'TH', 'phuket': 'TH', 'chiang mai': 'TH', 'pattaya': 'TH',
  'krabi': 'TH', 'koh samui': 'TH', 'hua hin': 'TH', 'phi phi': 'TH',
  'singapore': 'SG', 'kuala lumpur': 'MY', 'penang': 'MY', 'langkawi': 'MY',
  'bali': 'ID', 'jakarta': 'ID', 'lombok': 'ID', 'yogyakarta': 'ID',
  'ubud': 'ID', 'seminyak': 'ID', 'kuta': 'ID', 'nusa dua': 'ID',
  'hanoi': 'VN', 'ho chi minh': 'VN', 'saigon': 'VN', 'da nang': 'VN',
  'hoi an': 'VN', 'nha trang': 'VN', 'phu quoc': 'VN', 'halong bay': 'VN',
  'manila': 'PH', 'boracay': 'PH', 'cebu': 'PH', 'palawan': 'PH', 'el nido': 'PH',
  'phnom penh': 'KH', 'siem reap': 'KH', 'angkor wat': 'KH',
  'vientiane': 'LA', 'luang prabang': 'LA',
  'yangon': 'MM', 'bagan': 'MM',

  // Asia - South
  'mumbai': 'IN', 'delhi': 'IN', 'new delhi': 'IN', 'goa': 'IN',
  'jaipur': 'IN', 'agra': 'IN', 'kerala': 'IN', 'bangalore': 'IN',
  'chennai': 'IN', 'kolkata': 'IN', 'udaipur': 'IN', 'varanasi': 'IN',
  'hyderabad': 'IN', 'pune': 'IN', 'shimla': 'IN', 'rishikesh': 'IN',
  'colombo': 'LK', 'kandy': 'LK', 'galle': 'LK', 'ella': 'LK',
  'kathmandu': 'NP', 'pokhara': 'NP',
  'dhaka': 'BD', 'karachi': 'PK', 'lahore': 'PK', 'islamabad': 'PK',

  // Asia - Korea
  'seoul': 'KR', 'busan': 'KR', 'jeju': 'KR', 'incheon': 'KR', 'gyeongju': 'KR',

  // Middle East
  'dubai': 'AE', 'abu dhabi': 'AE', 'sharjah': 'AE', 'ras al khaimah': 'AE',
  'doha': 'QA', 'manama': 'BH', 'muscat': 'OM', 'kuwait city': 'KW',
  'riyadh': 'SA', 'jeddah': 'SA', 'mecca': 'SA', 'medina': 'SA',
  'tel aviv': 'IL', 'jerusalem': 'IL', 'eilat': 'IL', 'haifa': 'IL',
  'amman': 'JO', 'petra': 'JO', 'dead sea': 'JO', 'aqaba': 'JO',
  'beirut': 'LB', 'tehran': 'IR',

  // Africa - North
  'cairo': 'EG', 'luxor': 'EG', 'aswan': 'EG', 'alexandria': 'EG',
  'hurghada': 'EG', 'sharm el sheikh': 'EG', 'marrakech': 'MA', 'marrakesh': 'MA',
  'casablanca': 'MA', 'fes': 'MA', 'fez': 'MA', 'tangier': 'MA', 'agadir': 'MA',
  'tunis': 'TN', 'sousse': 'TN', 'djerba': 'TN',

  // Africa - East
  'nairobi': 'KE', 'mombasa': 'KE', 'masai mara': 'KE', 'diani': 'KE',
  'dar es salaam': 'TZ', 'zanzibar': 'TZ', 'serengeti': 'TZ', 'arusha': 'TZ',
  'kilimanjaro': 'TZ', 'addis ababa': 'ET', 'kigali': 'RW',
  'kampala': 'UG', 'entebbe': 'UG', 'seychelles': 'SC', 'mahe': 'SC',
  'mauritius': 'MU', 'port louis': 'MU', 'maldives': 'MV', 'male': 'MV',
  'reunion': 'RE', 'madagascar': 'MG', 'antananarivo': 'MG',

  // Africa - Southern
  'victoria falls': 'ZW', 'harare': 'ZW', 'lusaka': 'ZM', 'livingstone': 'ZM',
  'windhoek': 'NA', 'swakopmund': 'NA', 'etosha': 'NA', 'sossusvlei': 'NA',
  'gaborone': 'BW', 'kasane': 'BW', 'maun': 'BW', 'okavango': 'BW',
  'maputo': 'MZ', 'tofo': 'MZ', 'bazaruto': 'MZ',

  // Africa - West
  'accra': 'GH', 'lagos': 'NG', 'dakar': 'SN', 'abidjan': 'CI',

  // Caribbean
  'cancun': 'MX', 'playa del carmen': 'MX', 'tulum': 'MX', 'cozumel': 'MX',
  'mexico city': 'MX', 'cabo': 'MX', 'los cabos': 'MX', 'puerto vallarta': 'MX',
  'havana': 'CU', 'varadero': 'CU', 'punta cana': 'DO', 'santo domingo': 'DO',
  'san juan': 'PR', 'nassau': 'BS', 'bahamas': 'BS', 'jamaica': 'JM',
  'montego bay': 'JM', 'negril': 'JM', 'ocho rios': 'JM',
  'barbados': 'BB', 'bridgetown': 'BB', 'aruba': 'AW', 'curacao': 'CW',
  'st lucia': 'LC', 'antigua': 'AG', 'st maarten': 'SX', 'turks and caicos': 'TC',
  'cayman islands': 'KY', 'grand cayman': 'KY', 'virgin islands': 'VI',
  'trinidad': 'TT', 'grenada': 'GD', 'st kitts': 'KN', 'martinique': 'MQ',
  'guadeloupe': 'GP', 'bermuda': 'BM',

  // Central America
  'panama city': 'PA', 'san jose': 'CR', 'costa rica': 'CR', 'manuel antonio': 'CR',
  'monteverde': 'CR', 'la fortuna': 'CR', 'tamarindo': 'CR',
  'belize city': 'BZ', 'san pedro': 'BZ', 'placencia': 'BZ',
  'guatemala city': 'GT', 'antigua guatemala': 'GT', 'tikal': 'GT',
  'managua': 'NI', 'granada nicaragua': 'NI', 'tegucigalpa': 'HN', 'roatan': 'HN',
  'san salvador': 'SV',

  // South America
  'rio de janeiro': 'BR', 'sao paulo': 'BR', 'salvador': 'BR', 'florianopolis': 'BR',
  'iguazu': 'BR', 'buzios': 'BR', 'fortaleza': 'BR', 'recife': 'BR',
  'buenos aires': 'AR', 'mendoza': 'AR', 'bariloche': 'AR', 'ushuaia': 'AR',
  'iguazu falls': 'AR', 'el calafate': 'AR', 'salta': 'AR', 'cordoba argentina': 'AR',
  'santiago': 'CL', 'valparaiso': 'CL', 'atacama': 'CL', 'patagonia': 'CL',
  'torres del paine': 'CL', 'easter island': 'CL',
  'lima': 'PE', 'cusco': 'PE', 'machu picchu': 'PE', 'arequipa': 'PE',
  'sacred valley': 'PE', 'puno': 'PE', 'lake titicaca': 'PE',
  'bogota': 'CO', 'cartagena': 'CO', 'medellin': 'CO', 'santa marta': 'CO',
  'quito': 'EC', 'galapagos': 'EC', 'guayaquil': 'EC', 'cuenca': 'EC',
  'la paz': 'BO', 'uyuni': 'BO', 'sucre': 'BO',
  'montevideo': 'UY', 'punta del este': 'UY',
  'asuncion': 'PY', 'caracas': 'VE',

  // Pacific Islands
  'fiji': 'FJ', 'suva': 'FJ', 'nadi': 'FJ', 'tahiti': 'PF', 'bora bora': 'PF',
  'moorea': 'PF', 'samoa': 'WS', 'tonga': 'TO', 'vanuatu': 'VU',
  'new caledonia': 'NC', 'noumea': 'NC', 'palau': 'PW', 'guam': 'GU',
};

// Country name to code mapping for country-level searches
const COUNTRY_CODE_MAP: Record<string, string> = {
  'south africa': 'ZA', 'united kingdom': 'GB', 'uk': 'GB', 'england': 'GB',
  'france': 'FR', 'united states': 'US', 'usa': 'US', 'america': 'US',
  'canada': 'CA', 'australia': 'AU', 'new zealand': 'NZ', 'germany': 'DE',
  'italy': 'IT', 'spain': 'ES', 'portugal': 'PT', 'netherlands': 'NL',
  'belgium': 'BE', 'switzerland': 'CH', 'austria': 'AT', 'greece': 'GR',
  'turkey': 'TR', 'croatia': 'HR', 'czech republic': 'CZ', 'czechia': 'CZ',
  'hungary': 'HU', 'poland': 'PL', 'denmark': 'DK', 'sweden': 'SE',
  'norway': 'NO', 'finland': 'FI', 'iceland': 'IS', 'russia': 'RU',
  'japan': 'JP', 'china': 'CN', 'thailand': 'TH', 'indonesia': 'ID',
  'malaysia': 'MY', 'vietnam': 'VN', 'philippines': 'PH', 'cambodia': 'KH',
  'india': 'IN', 'sri lanka': 'LK', 'nepal': 'NP', 'south korea': 'KR',
  'korea': 'KR', 'uae': 'AE', 'united arab emirates': 'AE', 'qatar': 'QA',
  'saudi arabia': 'SA', 'israel': 'IL', 'jordan': 'JO', 'egypt': 'EG',
  'morocco': 'MA', 'tunisia': 'TN', 'kenya': 'KE', 'tanzania': 'TZ',
  'namibia': 'NA', 'botswana': 'BW', 'zimbabwe': 'ZW', 'zambia': 'ZM',
  'mozambique': 'MZ', 'mexico': 'MX', 'cuba': 'CU', 'dominican republic': 'DO',
  'jamaica': 'JM', 'costa rica': 'CR', 'panama': 'PA', 'belize': 'BZ',
  'guatemala': 'GT', 'brazil': 'BR', 'argentina': 'AR', 'chile': 'CL',
  'peru': 'PE', 'colombia': 'CO', 'ecuador': 'EC', 'bolivia': 'BO',
  'uruguay': 'UY', 'fiji': 'FJ', 'french polynesia': 'PF',
};

function getCountryCode(destination: string): string | null {
  const normalized = destination.toLowerCase().trim();

  // Direct city match
  if (CITY_COUNTRY_MAP[normalized]) {
    return CITY_COUNTRY_MAP[normalized];
  }

  // Check if it's a country name
  if (COUNTRY_CODE_MAP[normalized]) {
    return COUNTRY_CODE_MAP[normalized];
  }

  // Try partial match (e.g., "cape" matches "cape town")
  for (const [city, code] of Object.entries(CITY_COUNTRY_MAP)) {
    if (city.includes(normalized) || normalized.includes(city)) {
      return code;
    }
  }

  return null;
}

function getCityName(destination: string): string {
  const normalized = destination.toLowerCase().trim();

  // If it's a country, don't use it as cityName
  if (COUNTRY_CODE_MAP[normalized]) {
    return '';
  }

  // Return original destination for city search
  return destination;
}

// Search hotels
export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return getMockHotels(params.destination);
  }

  const countryCode = getCountryCode(params.destination);
  const cityName = getCityName(params.destination);

  try {
    // Build query parameters
    let url = `${API_BASE}/data/hotels?limit=5000`;

    if (countryCode && cityName) {
      // We have both country and city
      url += `&countryCode=${countryCode}&cityName=${encodeURIComponent(cityName)}`;
    } else if (countryCode && !cityName) {
      // Country-level search (e.g., "France", "Thailand")
      url += `&countryCode=${countryCode}`;
    } else {
      // Unknown destination - try cityName search
      url += `&cityName=${encodeURIComponent(params.destination)}`;
    }

    console.log(`[LiteAPI] Searching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[LiteAPI] API error:', response.status, errorText);

      // If countryCode search failed, try just cityName as fallback
      if (countryCode) {
        console.log('[LiteAPI] Retrying with cityName only...');
        const fallbackUrl = `${API_BASE}/data/hotels?limit=5000&cityName=${encodeURIComponent(params.destination)}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: {
            'X-API-Key': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackHotels = fallbackData.data || fallbackData.hotels || fallbackData;
          if (Array.isArray(fallbackHotels) && fallbackHotels.length > 0) {
            console.log(`[LiteAPI] Fallback found ${fallbackHotels.length} hotels`);
            return fallbackHotels.map(transformHotel);
          }
        }
      }

      return getMockHotels(params.destination);
    }

    const data = await response.json();
    const hotels = data.data || data.hotels || data;

    if (Array.isArray(hotels) && hotels.length > 0) {
      console.log(`[LiteAPI] Found ${hotels.length} hotels in ${params.destination}`);
      return hotels.map(transformHotel);
    }

    console.log('[LiteAPI] No hotels found, using mock data');
    return getMockHotels(params.destination);
  } catch (error) {
    console.error('[LiteAPI] Request failed:', error);
    return getMockHotels(params.destination);
  }
}

// Get hotel details
export async function getHotel(hotelId: string): Promise<Hotel | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return getMockHotel(hotelId) || null;
  }

  try {
    const response = await fetch(
      `${API_BASE}/data/hotel?hotelId=${encodeURIComponent(hotelId)}`,
      {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return getMockHotel(hotelId) || null;
    }

    const data = await response.json();
    return transformHotel(data.data || data);
  } catch (error) {
    console.error('[LiteAPI] Request failed:', error);
    return getMockHotel(hotelId) || null;
  }
}

// Get rates for a hotel
export async function getHotelRates(
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<HotelRate[]> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return getMockRates(hotelId);
  }

  try {
    const response = await fetch(`${API_BASE}/hotels/rates`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hotelIds: [hotelId],
        checkin: checkIn,
        checkout: checkOut,
        occupancies: [{ adults: guests }],
        currency: 'USD',
        guestNationality: 'US',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[LiteAPI] Rates error:', response.status, errorText);
      return getMockRates(hotelId);
    }

    const data = await response.json();
    const roomTypes = data.data?.[0]?.roomTypes || [];

    // Flatten all rates from all room types
    const allRates: HotelRate[] = [];
    for (const room of roomTypes) {
      const rates = room.rates || [];
      for (const rate of rates) {
        // Get price from retailRate or use rate price
        const retailRate = rate.retailRate || {};
        const totalArray = retailRate.total || [];
        const priceInfo = totalArray[0] || {};
        const price = priceInfo.amount || rate.price || 0;

        allRates.push({
          hotelId,
          roomType: String(room.name || 'Standard Room'),
          boardType: String(rate.boardName || rate.boardType || 'Room Only'),
          price: applyMarkup(Number(price)),
          originalPrice: Number(price),
          currency: String(priceInfo.currency || 'USD'),
          cancellationPolicy: rate.cancellationPolicy?.cancelPolicyInfos?.[0]?.description || 'Check hotel policy',
          rateId: String(rate.rateId || `rate-${Date.now()}`),
          offerId: String(room.offerId || ''),
        });
      }
    }

    console.log(`[LiteAPI] Found ${allRates.length} rates for hotel ${hotelId}`);
    return allRates.length > 0 ? allRates : getMockRates(hotelId);
  } catch (error) {
    console.error('[LiteAPI] Request failed:', error);
    return getMockRates(hotelId);
  }
}

// Prebook - Create checkout session
export interface PrebookResponse {
  success: boolean;
  prebookId?: string;
  transactionId?: string;
  secretKey?: string;
  error?: string;
}

export async function prebook(offerId: string): Promise<PrebookResponse> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      success: true,
      prebookId: `demo-prebook-${Date.now()}`,
      transactionId: `demo-txn-${Date.now()}`,
      secretKey: 'demo-secret-key',
    };
  }

  try {
    const response = await fetch(`${API_BASE}/rates/prebook`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offerId,
        usePaymentSdk: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Prebook failed',
      };
    }

    return {
      success: true,
      prebookId: data.data?.prebookId || data.prebookId,
      transactionId: data.data?.transactionId || data.transactionId,
      secretKey: data.data?.secretKey || data.secretKey,
    };
  } catch (error) {
    console.error('[LiteAPI] Prebook failed:', error);
    return {
      success: false,
      error: 'Prebook request failed',
    };
  }
}

// Book - Complete the reservation
export interface BookRequest {
  prebookId: string;
  transactionId: string;
  holder: {
    firstName: string;
    lastName: string;
    email: string;
  };
  guests: Array<{
    firstName: string;
    lastName: string;
  }>;
  clientReference?: string;
}

export interface BookResponse {
  success: boolean;
  bookingId?: string;
  confirmationCode?: string;
  status?: string;
  error?: string;
}

export async function book(request: BookRequest): Promise<BookResponse> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      success: true,
      bookingId: `DEMO-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      confirmationCode: `CONF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'confirmed',
    };
  }

  try {
    const response = await fetch(`${API_BASE}/rates/book`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prebookId: request.prebookId,
        holder: request.holder,
        guests: request.guests,
        payment: {
          method: 'TRANSACTION_ID',
          transactionId: request.transactionId,
        },
        clientReference: request.clientReference || `agentix-${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Booking failed',
      };
    }

    return {
      success: true,
      bookingId: data.data?.bookingId || data.bookingId,
      confirmationCode: data.data?.supplierBookingId || data.confirmationCode,
      status: data.data?.status || 'confirmed',
    };
  } catch (error) {
    console.error('[LiteAPI] Book failed:', error);
    return {
      success: false,
      error: 'Booking request failed',
    };
  }
}
