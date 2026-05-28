"use server";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { AES, enc } from "crypto-js";

const LOGOUT_SECRET_KEY = process.env.NEXT_PUBLIC_LOGOUT_SECRET_KEY as string;

export async function POST(request: Request) {
  try {
    // 1. Ambil custom token dari body atau header
    const { logout_token } = await request.json();

    if (!logout_token) {
      return NextResponse.json(
        { status: false, message: "Token tidak ditemukan" },
        { status: 400 },
      );
    }

    const decryptedToken = AES.decrypt(
      logout_token,
      process.env.KEY_PASSPHRASE as string,
    ).toString(enc.Utf8);

    // 2. Verifikasi token (sederhana, hanya cek kesamaan dengan secret key)
    const payload = jwt.verify(decryptedToken, LOGOUT_SECRET_KEY);

    if (!payload) {
      return NextResponse.json(
        { status: false, message: "Token tidak valid" },
        { status: 401 },
      );
    }

    // 4. Kembalikan response sukses
    const response = NextResponse.json({
      success: true,
      message: "SSO Logout Berhasil",
    });
    response.cookies.delete("panel_sso_token");
    response.cookies.delete("panel_sso_token_plain");
    return response;
  } catch (error) {
    return NextResponse.json(
      { status: false, message: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
}
