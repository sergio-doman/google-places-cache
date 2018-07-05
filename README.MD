# Google places caching microservice

## Requirements

```
Nominatim
Node.JS 8+
Redis server
```

## Install

```
npm install

```

## API

Health check

GET /places/ok



Get stats

GET /places/stats

places_get_found - how many places has been found during

places_get_notfound - how many places has been not found during

places_get_found_percent - how many places been found in percents

places_add - how many places been added

places_dbsize - total cached items count

Update interval 1 min by default


Search for places in cache

GET /places?lang=tur&query=1&latlon[]=41.036506000000002814&latlon[]=28.997160000000000935

lang is language code from ISO 639-3

latlon - gps location of user

query - text user typed



Add new place to cache

POST /places
```
{
  "latlon": [
    41.036506000000002814,
    28.997160000000000935
  ],

  "lang": "tur",
  "predictions": [
    {
      "types": [
        "administrative_area_level_4",
        "political",
        "geocode"
      ],
      "terms": [
        {
          "value": "Bahçeşehir 2. Kısım Mahallesi",
          "offset": 0
        },
        {
          "value": "Başakşehir",
          "offset": 31
        },
        {
          "value": "İstanbul",
          "offset": 42
        },
        {
          "value": "Türkiye",
          "offset": 52
        }
      ],
      "structured_formatting": {
        "secondary_text": "Başakşehir/İstanbul, Türkiye",
        "main_text_matched_substrings": [
          {
            "offset": 0,
            "length": 10
          }
        ],
        "main_text": "Bahçeşehir 2. Kısım Mahallesi"
      },
      "reference": "CpQBhgAAAGGaQwWN7wKYUegr4foYPt7Xb5WtoDEBnzzYyVHagbrpB76sgZs6M8J7QajOJXceA2BUAavyIvXc3aExe4vnlMalc8BYhf76fuvkqSg3t8DAjwP2zIgQLGoihSShw4nmTVgfhZYHaMOXUjI0CM8bU7dk7dcNfqArD4ncII2j_V4iFqpxTkmsy6xwebFypxV5ZxIQV91DTgQl84THIpIvkgn7qxoUOlBMN2wnE18g_Gw6nBYwV5eQ7ZU",
      "place_id": "ChIJazDDun1YtRQRSMQBjeKr-F4",
      "matched_substrings": [
        {
          "offset": 0,
          "length": 10
        }
      ],
      "id": "dd36b08bd4ca93a497bbb0b184a0a372c5b79171",
      "description": "Bahçeşehir 2. Kısım Mahallesi, Başakşehir/İstanbul, Türkiye"
    },
    {
      "types": [
        "administrative_area_level_4",
        "political",
        "geocode"
      ],
      "terms": [
        {
          "value": "Bahçeşehir 1. Kısım Mahallesi",
          "offset": 0
        },
        {
          "value": "Başakşehir",
          "offset": 31
        },
        {
          "value": "İstanbul",
          "offset": 42
        },
        {
          "value": "Türkiye",
          "offset": 52
        }
      ],
      "structured_formatting": {
        "secondary_text": "Başakşehir/İstanbul, Türkiye",
        "main_text_matched_substrings": [
          {
            "offset": 0,
            "length": 10
          }
        ],
        "main_text": "Bahçeşehir 1. Kısım Mahallesi"
      },
      "reference": "CpQBhgAAAAA-PWzUlf-KpJ7dy3YTDX4pnnMQLafL7PEje8wzwMSB0eEIweRs7r-xUV8nek9EuYkdWGg4R1boIwtVgrC9pYQHoubdadTBV06Whz2J7hO7AcnbAFcYEUAIOeBO6AS8GHjMKsXnSx3gKt92tadiEgAkrLA8GkdQIMDwWqKb5zDGSi86QlvFVQpG6k6iXPIifRIQEq-zifTcN0DBtJfRdJky5hoUc0oG7Yv1a6Rmyf18g0CPlx0gdd0",
      "place_id": "ChIJz3vYAL2nyhQR--OWsb5BoSM",
      "matched_substrings": [
        {
          "offset": 0,
          "length": 10
        }
      ],
      "id": "184013fba0558f5f07b205697cd5bb03d66a3b8f",
      "description": "Bahçeşehir 1. Kısım Mahallesi, Başakşehir/İstanbul, Türkiye"
    },
    {
      "types": [
        "transit_station",
        "point_of_interest",
        "establishment",
        "geocode"
      ],
      "terms": [
        {
          "value": "Bahçeşehir Merkez",
          "offset": 0
        },
        {
          "value": "Bahçeşehir 2. Kısım Mahallesi",
          "offset": 19
        },
        {
          "value": "Başakşehir",
          "offset": 50
        },
        {
          "value": "İstanbul",
          "offset": 61
        },
        {
          "value": "Türkiye",
          "offset": 71
        }
      ],
      "structured_formatting": {
        "secondary_text": "Bahçeşehir 2. Kısım Mahallesi, Başakşehir/İstanbul, Türkiye",
        "main_text_matched_substrings": [
          {
            "offset": 0,
            "length": 10
          }
        ],
        "main_text": "Bahçeşehir Merkez"
      },
      "reference": "CqQBkgAAAI6A0kFaH24h5db2hzQnmpyn4DkvFlmSVK6NJlZxsMO--nODNkVnpq1n6h5EEV0h-q6IHB6XTnfy73vUDJzX0JEAJNJkX4yd_-DbRT2ln226vLYlyEBGxYSE4TIzhvN5H7fXwowYazA3kN_xXuHbmJI_HSROUxeV9wn9HhUwHlAmtaVV9GgvkRGNxNT4daNjKdSyPubFGXTqkLAfVgOrVLYSEGmx4PGvm0F22QR4lXkzUMcaFGHYLL4owwlKpaH2cyPu_hzD_PDI",
      "place_id": "ChIJEV1gq2-nyhQRfThJbquzFrw",
      "matched_substrings": [
        {
          "offset": 0,
          "length": 10
        }
      ],
      "id": "7d95220db6f3eaf3eaeb19dfc0f693cb0e6fa647",
      "description": "Bahçeşehir Merkez, Bahçeşehir 2. Kısım Mahallesi, Başakşehir/İstanbul, Türkiye"
    },
    {
      "types": [
        "transit_station",
        "point_of_interest",
        "establishment",
        "geocode"
      ],
      "terms": [
        {
          "value": "Beşiktaş Bahçeşehir Üniversitesi",
          "offset": 0
        },
        {
          "value": "Sinanpaşa Mahallesi",
          "offset": 34
        },
        {
          "value": "Beşiktaş Caddesi",
          "offset": 55
        },
        {
          "value": "Beşiktaş",
          "offset": 73
        },
        {
          "value": "İstanbul",
          "offset": 82
        },
        {
          "value": "Türkiye",
          "offset": 92
        }
      ],
      "structured_formatting": {
        "secondary_text": "Sinanpaşa Mahallesi, Beşiktaş Caddesi, Beşiktaş/İstanbul, Türkiye",
        "main_text_matched_substrings": [
          {
            "offset": 9,
            "length": 10
          }
        ],
        "main_text": "Beşiktaş Bahçeşehir Üniversitesi"
      },
      "reference": "CrQBqQAAALerVzEk797D73Ni2GVouZhi1uEbIibWvGUAQj8nmwWoxtP5vurCspgzqEO72agGZrfQ-br_2CEqmKBMm24XNV5Cary6zGjcJ79NznP6Z9K5JnjGHayYZy0VUIzpvLJmDo0FrcR9YG4WzS1Km4Fr3SLe_D0lAdiaPq7_F4tVhjq_2GpnOJN_axR8Uabpt-Rv6wALgSym5_H3ABBD7Aen-6G_iudIFIl3Mq3d3N3k6mNsEhDNjAwNkNimExCy9URtoAzMGhQjA-DLe7GmQPKnROVZ4A6GI2tQNg",
      "place_id": "ChIJZwJyeaK3yhQR56gD-FW76LA",
      "matched_substrings": [
        {
          "offset": 9,
          "length": 10
        }
      ],
      "id": "e46a72a77b77a8662d34870e06318a904f3f7abf",
      "description": "Beşiktaş Bahçeşehir Üniversitesi, Sinanpaşa Mahallesi, Beşiktaş Caddesi, Beşiktaş/İstanbul, Türkiye"
    },
    {
      "types": [
        "establishment"
      ],
      "terms": [
        {
          "value": "Yıldız Mahallesi",
          "offset": 0
        },
        {
          "value": "Bahçeşehir Üniversitesi",
          "offset": 18
        },
        {
          "value": "Beşiktaş",
          "offset": 43
        },
        {
          "value": "İstanbul",
          "offset": 52
        },
        {
          "value": "Türkiye",
          "offset": 62
        }
      ],
      "structured_formatting": {
        "secondary_text": "Yıldız Mahallesi, Beşiktaş/İstanbul, Türkiye",
        "main_text_matched_substrings": [
          {
            "offset": 0,
            "length": 10
          }
        ],
        "main_text": "Bahçeşehir Üniversitesi"
      },
      "reference": "CpQBhwAAAJPTc8T1esMhGN_2XEgle63tvyoHp7-APnxuyqDfUSEx6QXCq3kO3ExIDA0XyE__0nyOuuPSjzjJzyy0tWRUSRZFLZovY5kbM6VNsNBx3reH7JbpEGHDOGamxGzdoZZWluCMtPWTnRmsBn5HDHKhIhjzAwhxd-BH-MIMKSHbmNZTdQ3SoJov7z5PanpyF7VXXRIQDLDUTjlNWteanxFjvzMzpxoUxnpKAIoqWZR1eDxibO1nYvWXNlw",
      "place_id": "ChIJY7nDoqK3yhQRGYV7gbnRcXY",
      "matched_substrings": [
        {
          "offset": 18,
          "length": 10
        }
      ],
      "id": "f044dd09704983539947ca0c261e04eabe34d103",
      "description": "Yıldız Mahallesi, Bahçeşehir Üniversitesi, Beşiktaş/İstanbul, Türkiye"
    }
  ],
  "query": "bahçeşehir"
}
```



## Links

https://nominatim.openstreetmap.org/

https://en.wikipedia.org/wiki/ISO_639-3
