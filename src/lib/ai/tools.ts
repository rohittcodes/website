import { tool } from "ai";
import { z } from "zod";
import { Resend } from "resend";
import { person } from "@/resources";

const emailSchema = z
  .string()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address");
import {
  getAboutKnowledge,
  getBlogKnowledge,
  getBlogTitles,
  getContactKnowledge,
  getNowKnowledge,
  getProjectsKnowledge,
  getProjectTitles,
  getUsesKnowledge,
  isAllowedPath,
} from "./knowledge";

export const portfolioTools = {
  getAbout: tool({
    description: "Get Rohith's bio, experience, education, skills, and social links.",
    inputSchema: z.object({}),
    execute: async () => getAboutKnowledge(),
  }),

  listProjectTitles: tool({
    description:
      "List every portfolio project title, nothing else. Call this first when asked about projects, then call getProjects for the ones that look relevant.",
    inputSchema: z.object({}),
    execute: async () => getProjectTitles(),
  }),

  getProjects: tool({
    description:
      "Get full project details (summary, tags, link). Only use when the visitor asks about projects/work/portfolio. Do not use this to explain a stack tool like tRPC or Next.js.",
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe("Optional search keyword to filter projects"),
    }),
    execute: async ({ query }) => getProjectsKnowledge(query),
  }),

  listBlogTitles: tool({
    description:
      "List every blog post title, nothing else. Call this first when asked about writing or blog posts, then call getBlogPosts for the ones that look relevant.",
    inputSchema: z.object({}),
    execute: async () => getBlogTitles(),
  }),

  getBlogPosts: tool({
    description: "Get full details (summary, date, path) for blog posts.",
    inputSchema: z.object({
      limit: z.number().min(1).max(10).optional().describe("How many posts to return"),
    }),
    execute: async ({ limit }) => getBlogKnowledge(limit ?? 6),
  }),

  getUses: tool({
    description:
      "Get Rohith's setup with short descriptions: editor, stack, AI tools, hardware, and apps. Use this for stack/setup questions and for explaining a specific tool from the setup (e.g. what is tRPC).",
    inputSchema: z.object({}),
    execute: async () => getUsesKnowledge(),
  }),

  getNow: tool({
    description: "Get what Rohith is building and learning right now.",
    inputSchema: z.object({}),
    execute: async () => getNowKnowledge(),
  }),

  getContactInfo: tool({
    description: "Get public contact channels (email, calendar, social links).",
    inputSchema: z.object({}),
    execute: async () => getContactKnowledge(),
  }),

  suggestFollowUps: tool({
    description:
      "Suggest 2-3 short follow-up questions the visitor can tap next. Call this after every substantive answer so the UI can show them as buttons.",
    inputSchema: z.object({
      prompts: z
        .array(z.string().min(3).max(90))
        .min(2)
        .max(3)
        .describe("Short, natural follow-up questions from the visitor's point of view"),
    }),
    execute: async ({ prompts }) => ({ prompts }),
  }),

  navigateTo: tool({
    description:
      "Offer a button to open a site page. Only when the visitor asks to go somewhere or clearly wants to browse a page. Do not use this after an empty project search.",
    inputSchema: z.object({
      path: z
        .string()
        .describe("Site path such as /work, /blog, /about, /uses, /now"),
      reason: z.string().optional().describe("Short reason shown to the visitor"),
    }),
    execute: async ({ path, reason }) => {
      const normalized = path.startsWith("/") ? path : `/${path}`;
      const base = normalized.split("?")[0] ?? normalized;

      const allowed =
        isAllowedPath(base) ||
        base.startsWith("/work/") ||
        base.startsWith("/blog/");

      if (!allowed) {
        return {
          ok: false as const,
          error: `Path not allowed: ${normalized}`,
        };
      }

      return {
        ok: true as const,
        path: normalized,
        reason: reason ?? null,
      };
    },
  }),

  draftEmail: tool({
    description:
      "Draft an email from a visitor to Rohith. Collect intent first. Do not send yet.",
    inputSchema: z.object({
      visitorName: z.string().optional().describe("Visitor name if known"),
      visitorEmail: emailSchema.optional().describe("Visitor email if known"),
      subject: z.string().describe("Email subject"),
      message: z.string().describe("Email body in the visitor's voice"),
    }),
    execute: async ({ visitorName, visitorEmail, subject, message }) => ({
      status: "draft" as const,
      to: person.email,
      visitorName: visitorName ?? null,
      visitorEmail: visitorEmail ?? null,
      subject,
      message,
      needsConfirmation: true,
    }),
  }),

  sendContactEmail: tool({
    description:
      "Send a contact email to Rohith via Resend. Only call after the visitor explicitly confirms the draft and provides name + email.",
    inputSchema: z.object({
      visitorName: z.string().min(1).describe("Visitor full name"),
      visitorEmail: emailSchema.describe("Visitor email for reply-to"),
      subject: z.string().min(1).describe("Email subject"),
      message: z.string().min(1).describe("Email body"),
      confirmed: z
        .boolean()
        .describe("Must be true. Only set when the visitor confirmed sending."),
    }),
    execute: async ({ visitorName, visitorEmail, subject, message, confirmed }) => {
      if (!confirmed) {
        return {
          ok: false as const,
          error: "Sending blocked until the visitor confirms.",
        };
      }

      if (!process.env.RESEND_API_KEY) {
        return {
          ok: false as const,
          error: "Email is not configured on the server.",
        };
      }

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: person.email,
          replyTo: visitorEmail,
          subject: subject || `Message from ${visitorName} via portfolio chat`,
          text: `From: ${visitorName} (${visitorEmail})\nSource: portfolio chat\n\n${message}`,
        });

        if (error) {
          console.error("Chat contact email error:", error);
          return {
            ok: false as const,
            error: "Failed to send email. Ask the visitor to retry or use the contact form.",
          };
        }

        return {
          ok: true as const,
          message: "Email sent successfully.",
        };
      } catch (error) {
        console.error("Chat contact email error:", error);
        return {
          ok: false as const,
          error: "Failed to send email. Ask the visitor to retry or use the contact form.",
        };
      }
    },
  }),
};
