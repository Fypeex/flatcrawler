import {FlatFoxResult} from "./types/FlatFoxResult.js";
import {
    Flat
} from "./types/Flat";
import {Mail} from "./types/Mail";

export class Parser {
    static parseFlatFoxToFlat(flat: FlatFoxResult): Flat {
        return {
            id: flat.pk.toString(),
            listing: {
                address: {
                    geoCoordinates: {
                        accuracy: "HIGH",
                        latitude: parseInt(flat.latitude),
                        longitude: parseInt(flat.longitude),
                        manual: false
                    },
                    locality: flat.city,
                    postalCode: flat.zipcode.toString(),
                    street: flat.street
                },
                categories: [],
                characteristics: {
                    floor: flat.floor,
                    hasBalcony: !!flat.attributes.find((a) => a.name.toLowerCase().includes("balcony")),
                    livingSpace: flat.surface_living,
                    numberOfRooms: parseInt(flat.number_of_rooms),
                    yearLastRenovated: parseInt(flat.year_renovated)
                },
                id: flat.pk.toString(),
                localization: {
                    de: {
                        attachments: flat.images.map((image) => {
                            return {
                                file: image.url,
                                type: "IMAGE",
                                url: image.url

                            }
                        }),
                        text: {
                            description: flat.description,
                            title: flat.title
                        },
                        urls: []
                    },
                    primary: "de"
                },
                meta: {
                    createdAt: flat.created
                },
                offerType: flat.offer_type,
                platforms: ["flatfox"],
                prices: {
                    buy: {},
                    currency: "CHF",
                    rent: {
                        gross: flat.price_display,
                        interval: flat.price_unit.toUpperCase()
                    }

                },
                valueAddedServices: {bundle: ""}
            },
            listingCard: {
                size: "L"
            },
            listingType: {
                type: flat.object_type
            },
            remoteViewing: false
        }
    }
    static parseTextToBase64(text: string):string {
        return Buffer.from(text, 'utf8').toString('base64');
    }
    static parseBase64ToText(binary: string) {
        return Buffer.from(binary, 'base64').toString('utf8');
    }
    static parseFlatToEmail(mailData:Mail,flat:Flat):string {
        return `From: ${mailData.from}` + "\r\n" +
            `To: ${mailData.to}` + "\r\n" +
            `Subject: ${mailData.subject}` + "\r\n\r\n" +
            `${flat.listing.localization.de?.text.title}`
    }
    static parseEmailToRaw(email:string):string {
        return btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
}