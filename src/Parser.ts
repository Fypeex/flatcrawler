import {FlatFoxResult} from "./types/FlatFoxResult.js";
import {Flat} from "./types/Flat.js";
import {Mail} from "./types/Mail.js";
import fs from "fs";
import {ImmoscoutResultProperty} from "./types/ImmoscoutResult.js";

export class Parser {
    static parseFlatFoxToFlat(flat: FlatFoxResult): Flat {
        return {
            website: "flatfox",
            link: "https://flatfox.ch" + flat.url,
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
                                file: "https://flatfox.ch" + image.url,
                                type: "IMAGE",
                                url: "https://flatfox.ch" + image.url

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
    static parseImmoscoutToFlat(flat: ImmoscoutResultProperty): Flat {
        return {
            website: "immoscout",
            link: "https://immoscout.ch" + flat.propertyUrl,
            id: flat.id.toString(),
            listing: {
                address: {
                    geoCoordinates: {
                        accuracy: "HIGH",
                        latitude: parseInt(flat.latitude.toString()),
                        longitude: parseInt(flat.longitude.toString()),
                        manual: false
                    },
                    locality: flat.cityName,
                    postalCode: flat.zip.toString(),
                    street: flat.street
                },
                categories: [],
                characteristics: {
                    livingSpace: flat.surfaceLiving,
                    numberOfRooms: flat.numberOfRooms,
                },
                id: flat.id.toString(),
                localization: {
                    de: {
                        attachments: flat.images.map((image) => {
                            let url = image.url;
                            url = url.replace("{width}",image.originalWidth.toString())
                                .replace("{height}",image.originalHeight.toString())
                                .replace("{resizemode}","1")
                                .replace("{quality}","100")
                            return {
                                file: url,
                                type: "IMAGE",
                                url: url

                            }
                        }),
                        text: {
                            description: flat.shortDescription,
                            title: flat.title
                        },
                        urls: []
                    },
                    primary: "de"
                },
                offerType: flat.offerTypeId == 1? "RENT":"Unknown",
                platforms: ["immoscout"],
                prices: {
                    buy: {},
                    currency: "CHF",
                    rent: {
                        gross: parseInt(flat.priceFormatted.replace("CHF","")),
                        interval: "Unknown"
                    }

                },
                valueAddedServices: {bundle: ""}
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
        
        let template: string = fs.readFileSync("./src/types/emailTemplate.html", "utf-8");
        template = template.replace("{{website}}", flat.website.slice(0, 1).toUpperCase() + flat.website.slice(1));
        template = template.replace("{{address}}", flat.listing.address.street + ", " + flat.listing.address.postalCode + " " + flat.listing.address.locality);
        template = template.replace("{{price}}", flat.listing.prices.rent.gross.toString());
        template = template.replace("{{rooms}}", flat.listing.characteristics.numberOfRooms?.toString() || "No data");
        template = template.replace("{{area}}", flat.listing.characteristics.livingSpace?.toString() || "No data");
        template = template.replace("{{description}}", flat.listing.localization.de?.text.description || "No description");
        template = template.replace("{{link}}", flat.link);
        template = template.replace("{{image}}", flat.listing.localization.de?.attachments[0]?.file || "");


        return `From:${mailData.from}` + "\r\n" +
            `To:${mailData.to}` + "\r\n" +
            `Subject: ${mailData.subject}` + "\r\n" +
            `Content-Type: text/html; charset=UTF-8` + "\r\n\r\n" +
            `${template}`
    }
    static parseEmailToRaw(email:string):string {
        return btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
}