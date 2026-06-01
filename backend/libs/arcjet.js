import arcjet, { shield, detectBot, tokenBucket, validateEmail } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

const aj = arcjet({
    // Get your site key from https://app.arcjet.com and set it as an environment
    // variable rather than hard coding.
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"], // Default is ["ip.src"], but you can customize
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode: "LIVE" }),
        // Create a bot detection rule
        detectBot({
            mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
            // Block all bots except the following
            allow: [
                "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
                // Uncomment to allow these other common bot categories
                // See the full list at https://arcjet.com/bot-list
                //"CATEGORY:MONITOR", // Uptime monitoring services
                //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
        }),
        validateEmail({
            mode: "LIVE",
            // Customize the email field name if needed (default is "email")
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"], // Block disposable, free, and toxic emails
        }),
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
            mode: "LIVE",
            requested: 1,
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),
    ],
});

export default aj;