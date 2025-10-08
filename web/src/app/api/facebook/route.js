// app/api/facebook/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const token = "1161464379236968|6FZkPlfxfU8SrMcSkBTdVCPujDk"; //
  process.env.FACEBOOK_TOKEN; // seu token no .env.local
  const pageId = process.env.FACEBOOK_PAGE_ID;

  const url = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=message,created_time,full_picture,permalink_url&access_token=${token}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
