import Medusa from "@medusajs/js-sdk";

export const medusa = new Medusa({
    baseUrl: "http://localhost:9000",
    publishableKey: "pk_f91b2bc1664d24e424ce82e34c884259ab18c6b6e6063a35f84cf42c944605de",
    auth: {
        type: "jwt"
    }
})