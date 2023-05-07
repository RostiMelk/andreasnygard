import type { NextApiRequest, NextApiResponse } from "next";

const preview = (req: NextApiRequest, res: NextApiResponse): void => {
  res.setPreviewData({});
  res.writeHead(307, { Location: "/" });
  res.end();
};

export default preview;
