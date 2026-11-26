import { handleAdminRequest } from "@/lib/donations-admin/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = handleAdminRequest;
export const POST = handleAdminRequest;
