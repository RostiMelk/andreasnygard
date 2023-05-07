import type { NextApiRequest, NextApiResponse } from "next";

const exit = (req: NextApiRequest, res: NextApiResponse): void => {
  res.clearPreviewData();
  res.writeHead(307, { Location: "/" });
  res.end();
};

export default exit;
