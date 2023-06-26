import type { NextApiRequest, NextApiResponse } from "next";
import { parseBody } from "next-sanity/webhook";

// Export the config from next-sanity to enable validating the request body signature properly
export { config } from "next-sanity/webhook";

export default async function revalidate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    const slug = body.slug as { current: string };
    if (!slug) {
      const message = "No slug provided";
      console.warn(message);
      res.status(400).json({ message });
      return;
    }

    if (!isValidSignature) {
      const message = "Invalid signature";
      console.warn(message);
      res.status(401).json({ message });
      return;
    }

    const staleRoute = `/${body._type}/${slug.current}`;
    await res.revalidate(staleRoute);
    const message = `Updated route: ${staleRoute}`;
    return res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
