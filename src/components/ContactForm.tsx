"use client";

import { Background, Button, Column, Heading, Input, Text, Textarea, opacity, SpacingToken } from "@once-ui-system/core";
import { mailchimp } from "@/resources";
import { useState } from "react";

export const ContactForm: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!message.trim()) return "Message can't be empty.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column
      position="relative"
      overflow="hidden"
      fillWidth
      fillHeight
      padding="xl"
      radius="l"
      gap="m"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      <Background
        top="0"
        left="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Column gap="4">
        <Heading as="h2" variant="display-strong-xs">Get in touch</Heading>
        <Text wrap="balance" variant="body-default-l" onBackground="neutral-weak">
          Have a project in mind, or just want to say hi? Drop me a message.
        </Text>
      </Column>
      {success ? (
        <Text variant="body-default-m" onBackground="brand-weak">
          Message sent. I&apos;ll get back to you soon.
        </Text>
      ) : (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Column fillWidth gap="8">
            <Input
              id="contact-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
            />
            <Input
              id="contact-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
            />
            <Textarea
              id="contact-message"
              placeholder="Your message"
              lines={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError("");
              }}
            />
            <Button type="submit" size="m" loading={loading} fillWidth>
              Send message
            </Button>
            {error && (
              <Text variant="body-default-xs" onBackground="danger-weak" paddingLeft="4">
                {error}
              </Text>
            )}
          </Column>
        </form>
      )}
    </Column>
  );
};
