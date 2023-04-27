export interface ImmoscoutResult {
    "pagingInfo": ImmoscoutResultPageinfo
    "properties": ImmoscoutResultProperty[],
    "allProperties": ImmoscoutResultPropertyShort[]
}

export type ImmoscoutResultPageinfo = {
    "currentPage": number,
    "itemsOnPage": number,
    "pageSize": number,
    "totalMatches": number,
    "totalPages": number,
    "isMaximumResults": boolean
}
export type ImmoscoutResultProperty = {
    "id": number,
    "accountId": number,
    "companyId": number,
    "memberPackageId": number,
    "agency": {
        "companyCity": string,
        "companyName1": string,
        "companyPhoneBusiness": string,
        "companyStreet": string,
        "companyZip": string,
        "showLogoOnSerp": boolean,
        "lastName": string,
        "logoUrl": string,
        "logoUrlDetailPage": string,
        "reference": string,
        "isAccountMigrated": true,
        "isGuest": false,
        "userType": string
    },
    "availableFrom": string,
    "availableFromFormatted": string,
    "cityId": number,
    "cityName": string,
    "commuteTimes": any
    "countryId": number,
    "geoAccuracy": number,
    "grossPriceFormatted": string,
    "hasNewBuildingProject": boolean,
    "hasVirtualTour": boolean,
    "isHighlighted": boolean,
    "isNeubauLite": boolean,
    "isNeubauLitePremium": boolean,
    "isHgCrosslisting": boolean,
    "isNew": boolean,
    "isNewEndDate": string,
    "isOnline": boolean,
    "isTopListing": boolean,
    "isPremiumToplisting": boolean,
    "lastModified": string,
    "latitude": number,
    "longitude": number,
    "normalizedPriceFormatted": string,
    "numberOfRooms": number,
    "numberOfRoomsFormatted": string,
    "offerTypeId": number,
    "priceUnitId": number,
    "priceFormatted": string,
    "propertyDetailUrl": string,
    "propertyUrl": string,
    "searchParameters": {
        "s": string,
        "t": string,
        "l": string,
        "pt": string,
        "nrf": string,
        "inp": string,
        "ct": string,
        "ci": string,
        "pn": string
    },
    "propertyCategoryId": number,
    "propertyTypeId": number,
    "stateShort": string,
    "state": string,
    "street": string,
    "surfaceLiving": number,
    "surfaceLivingFormatted": string,
    "title": string,
    "videoViewingEnabled": boolean,
    "zip": string,
    "zipId": number,
    "packageType": number,
    "shortDescription": string,
    "listingLayout": number,
    "packageScore": number,
    "isQualityListing": false,
    "images": ImmoscoutResultPropertyImage[]


    "lastPublished": string,
    "sortalgoScore": number,
    "sortalgoScore2": number,
    "listingCompletenessScore": number,
    "sortingPosition": number,
    "userRelevantScore": number,
    "isViewedProperty": boolean
}
export type ImmoscoutResultPropertyShort = {
    "id": number,
    "detailUrl": { [key in "de" | "fr" | "it" | "en"]: string }
    "geoAccuracy": number,
    "latitude": number,
    "longitude": number,
    "priceFormatted": {
        "value": "Price on request" | string
    },
    "projectName": string,
    "homstersPropertyDetailUrl": string,
    "isNewProperty": boolean
}
export type ImmoscoutResultPropertyImage =  {
    "url": string,
    "originalWidth": number,
    "originalHeight": number,
    "id": number,
    "title": string,
    "description": string,
    "sortOrder": number,
    "lastModified": string
}