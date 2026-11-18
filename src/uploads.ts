import * as Alchemy from "alchemy";
import * as Cloudflare from "@alchemy.run/cloudflare";

export const Uploads = Cloudflare.R2.Bucket("Uploads").pipe(Alchemy.RemovalPolicy.retain());
