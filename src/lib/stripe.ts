import Stripe from "stripe";
import config from "../config";

export const stripe = new Stripe(config.app_url as string)