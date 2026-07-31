"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Column, Input, Text, Textarea } from "@once-ui-system/core";
import { HotkeyBound } from "../keyboard/HotkeyBound";
import { HotkeyTarget } from "../keyboard/HotkeyBadge";
import styles from "./ChatWidget.module.scss";

type NavigateOutput = {
  ok: boolean;
  path?: string;
  reason?: string | null;
  error?: string;
};

type ProjectItem = {
  title: string;
  summary: string;
  path: string;
};

type DraftOutput = {
  status: "draft";
  to: string;
  visitorName: string | null;
  visitorEmail: string | null;
  subject: string;
  message: string;
  needsConfirmation: boolean;
};

type SendOutput = {
  ok: boolean;
  message?: string;
  error?: string;
};

function CardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.toolCard}>
      <Text variant="label-default-s" onBackground="neutral-weak">
        {title}
      </Text>
      <div className={styles.toolCardBody}>{children}</div>
    </div>
  );
}

export function NavigateCard({ output }: { output: NavigateOutput }) {
  const router = useRouter();

  if (!output.ok || !output.path) {
    return (
      <CardShell title="Navigation">
        <Text variant="body-default-s">{output.error || "Could not navigate."}</Text>
      </CardShell>
    );
  }

  return (
    <CardShell title="Open page">
      <Column gap="8">
        {output.reason && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            {output.reason}
          </Text>
        )}
        <HotkeyBound href={output.path}>
          <Button size="s" variant="secondary" onClick={() => router.push(output.path!)}>
            Go to {output.path}
          </Button>
        </HotkeyBound>
      </Column>
    </CardShell>
  );
}

export function ProjectsCard({ projects }: { projects: ProjectItem[] }) {
  const router = useRouter();

  if (!projects.length) return null;

  return (
    <CardShell title="Projects">
      <Column gap="8">
        {projects.slice(0, 4).map((project) => (
          <HotkeyTarget
            key={project.path}
            block
            onActivate={() => router.push(project.path)}
          >
            <button
              type="button"
              className={styles.toolLink}
              onClick={() => router.push(project.path)}
            >
              <Text variant="label-default-s">{project.title}</Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {project.summary}
              </Text>
            </button>
          </HotkeyTarget>
        ))}
      </Column>
    </CardShell>
  );
}

export function DraftEmailCard({ output }: { output: DraftOutput }) {
  const [name, setName] = useState(output.visitorName ?? "");
  const [email, setEmail] = useState(output.visitorEmail ?? "");
  const [subject, setSubject] = useState(output.subject);
  const [message, setMessage] = useState(output.message);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Name, email, and message are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: `Subject: ${subject}\n\n${message.trim()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <CardShell title="Draft email">
        <Text variant="body-default-s">Message sent. Rohith will get back to you.</Text>
      </CardShell>
    );
  }

  return (
    <CardShell title="Draft email">
      <Column gap="8">
        <Text variant="body-default-xs" onBackground="neutral-weak">
          To: {output.to}
        </Text>
        <Input
          id="chat-draft-name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="chat-draft-email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="chat-draft-subject"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          id="chat-draft-message"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          lines={4}
        />
        {error && (
          <Text variant="body-default-xs" onBackground="danger-weak">
            {error}
          </Text>
        )}
        <Button size="s" variant="primary" loading={loading} onClick={handleSend}>
          Send message
        </Button>
      </Column>
    </CardShell>
  );
}

export function SendResultCard({ output }: { output: SendOutput }) {
  return (
    <CardShell title="Email">
      <Text variant="body-default-s">
        {output.ok ? output.message || "Sent." : output.error || "Failed to send."}
      </Text>
    </CardShell>
  );
}

export function GenericToolCard({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <CardShell title={title}>
      <Text variant="body-default-s">{summary}</Text>
    </CardShell>
  );
}
