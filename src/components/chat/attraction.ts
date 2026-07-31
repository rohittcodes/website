export const ATTRACTION_MESSAGES = [
  "Hey, I'm Rohith. Ask me anything",
  "Curious about my AI work?",
  "Want to collaborate? Let's talk",
  "Explore my projects with me",
] as const;

export const SUGGESTED_PROMPTS = [
  "What are you building right now?",
  "Show me your best AI projects",
  "How can I work with you?",
  "What's in your stack?",
] as const;

export function welcomeForPath(pathname: string) {
  if (pathname.startsWith("/work/") && pathname !== "/work/") {
    return "Hey — you're on a project page. Ask about this work, related projects, or how we can collaborate.";
  }
  if (pathname.startsWith("/blog/") && pathname !== "/blog/") {
    return "Hey — you're reading a post. Ask about this piece, related writing, or anything else on the site.";
  }
  if (pathname.startsWith("/uses")) {
    return "Hey — you're on my uses page. Ask about any tool here, or jump to work and contact.";
  }
  if (pathname.startsWith("/now")) {
    return "Hey — this is what I'm focused on right now. Ask for details, or about related projects.";
  }
  if (pathname.startsWith("/about")) {
    return "Hey — you're on about. Ask about experience, stack, or how we can work together.";
  }
  return "Hey, I'm Rohith's AI. Ask about my work, stack, writing, or how we can collaborate. I can also help you get in touch.";
}

export function suggestedPromptsForPath(pathname: string) {
  if (pathname.startsWith("/work/") && pathname !== "/work/") {
    return [
      "What problem does this solve?",
      "What stack did you use here?",
      "Show me related projects",
    ];
  }
  if (pathname.startsWith("/blog/") && pathname !== "/blog/") {
    return [
      "Summarize this post",
      "What else have you written?",
      "How does this connect to your work?",
    ];
  }
  if (pathname.startsWith("/uses")) {
    return [
      "What's in your stack?",
      "Why tRPC?",
      "What editor do you use?",
    ];
  }
  return [...SUGGESTED_PROMPTS];
}
