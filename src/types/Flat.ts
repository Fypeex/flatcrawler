export type FlatListingType = {
    "type": "PREMIUM" | string
}
export type FlatListingAddress = {
    "geoCoordinates": FlatListingAddressGeoCoordinates
    "locality": string,
    "postalCode": string,
    "street": string
}
export type FlatListingAddressGeoCoordinates = {
    "accuracy": "HIGH" | string,
    "manual": boolean,
    "latitude": number,
    "longitude": number
}
export type FlatListingCharacteristics = {
    "livingSpace"?: number,
    "numberOfRooms"?: number,
    "floor"?: number,
    "yearLastRenovated"?: number,
    "hasBalcony"?: boolean
}
export type FlatListingLocalization = {
    [key in "de" | "fr" | "it" | "en"]?: FlatListingLocalizationValue
} & {
    "primary": string
}
export type FlatListingLocalizationValueText = {
    "title": string,
    "description": string
}
export type FlatListingLocalizationValueAttachment = {
    "type": "IMAGE" | string,
    "url": string,
    "file": string
}
export type FlatListingLocalizationValue = {
    "urls": [],
    "text": FlatListingLocalizationValueText,
    "attachments": FlatListingLocalizationValueAttachment[]
}
export type FlatListingPrices = {
    "rent": FlatListingPriceRent
    "currency": "CHF" | "EUR" | "USD" | string,
    "buy": {}
}
export type FlatListingPriceRent = {
    "interval": "MONTH" | "YEAR" | "QUARTER" | "DAY" | string,
    "gross": number
}

export type FlatListing = {
    "address": FlatListingAddress
    "categories": ("APARTMENT" | "FLAT" | string)[],
    "characteristics": FlatListingCharacteristics,
    "id": string,
    "localization": FlatListingLocalization
    "meta"?: {
        "createdAt": string
    },
    "offerType": "RENT" | string,
    "platforms": string[],
    "prices": FlatListingPrices,
    "valueAddedServices": {
        "bundle": string
    }
}
export type FlatListingCard = {
    "size": string
}

export interface Flat  {
    "website": "homegate" | "flatfox" | string,
    "link": string,
    "listingType"?: FlatListingType
    "listing": FlatListing
    "listingCard"?: FlatListingCard
    "id": string,
    "remoteViewing": boolean,
}
export type FlatResponse = FlatResponseHomegate | FlatResponseFlatfox[];
export type FlatResponseHomegate = {
    "results": Flat[],
}
export type FlatResponseFlatfox = {
    "pk": string,
}
