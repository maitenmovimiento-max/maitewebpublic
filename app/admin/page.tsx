import type { Metadata } from "next";
import { AdminDashboard, type GuideDTO } from "@/components/admin/admin-dashboard";
import { LoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/auth";
import { isAdminConfigured, isDatabaseConfigured } from "@/lib/env";
import { listAllGuides } from "@/lib/guides";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Panel editorial", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <LoginForm configured={isAdminConfigured} />;

  const guides = await listAllGuides();
  const serialized: GuideDTO[] = guides.map((guide) => ({
    ...guide,
    coverImageUrl: guide.coverImageUrl || "",
    coverImageAlt: guide.coverImageAlt || "",
    seoTitle: guide.seoTitle || "",
    seoDescription: guide.seoDescription || "",
    createdAt: guide.createdAt.toISOString(),
    updatedAt: guide.updatedAt.toISOString(),
    publishedAt: guide.publishedAt?.toISOString() || null,
  }));

  return <AdminDashboard initialGuides={serialized} databaseConfigured={isDatabaseConfigured} />;
}
