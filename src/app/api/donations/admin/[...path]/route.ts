import { handleAdminRequest } from "@/lib/donations-admin/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Catch-all ensures future/unknown admin paths cross the same auth boundary.
export const GET = handleAdminRequest;
export const POST = handleAdminRequest;
export const PUT = handleAdminRequest;
export const PATCH = handleAdminRequest;
export const DELETE = handleAdminRequest;
